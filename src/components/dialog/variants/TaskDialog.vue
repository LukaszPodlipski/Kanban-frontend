<script setup lang="ts">
import DialogTemplate from '@/components/dialog/DialogTemplate.vue'
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon.vue'
import usePermittedUser from '@/composables/usePermittedUser'
import { useColumnsStore } from '@/stores/columns'
import { useLayoutStore } from '@/stores/layout'
import { useMembersStore } from '@/stores/members'
import { useProjectStore } from '@/stores/project'
import { useTasksStore } from '@/stores/tasks'
import { useWebsocketStore } from '@/stores/websocket'
import { DialogParams, iTab } from '@/types/coreTypes'
import { iTask, Task } from '@/types/taskTypes'
import rules from '@/utils/validators'
import Editor from 'primevue/editor'
import {
  computed,
  onBeforeMount,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from 'vue'
import { useI18n } from 'vue-i18n'

import CommentInput from './partials/CommentInputPartial.vue'
import ConnectedTask from './partials/ConnectedTaskPartial.vue'
import TaskComments from './partials/TaskCommentsPartial.vue'
import TaskHistory from './partials/TaskHistoryPartial.vue'

const tasksStore = useTasksStore()
const columnsStore = useColumnsStore()
const projectStore = useProjectStore()
const layoutStore = useLayoutStore()
const websocketStore = useWebsocketStore()
const membersStore = useMembersStore()

const { isViewer, checkIsEditor } = usePermittedUser()
const { t } = useI18n()

/* -------------------------------- ON DIALOG OPEN --------------------------------- */
/* ------------------------- fetch task and connect to WS -------------------------- */
const dialogItem = computed<iTask & { redirectedFromId?: number }>(
  () => layoutStore.dialog.item,
)

onBeforeMount(() => {
  websocketStore.joinChannel('TaskIndexChannel', {
    projectId: projectStore.project?.id,
    taskId: dialogItem.value.id,
  })
})

onMounted(async () => {
  await tasksStore.getItem(dialogItem.value.id)
})

watch(
  () => dialogItem?.value?.id,
  async () => {
    if (dialogItem?.value?.id) {
      websocketStore.leaveChannel('TaskIndexChannel')
      websocketStore.joinChannel('TaskIndexChannel', {
        projectId: projectStore.project?.id,
        taskId: dialogItem.value.id,
      })
      await tasksStore.getItem(dialogItem.value.id)
    }
  },
)

onUnmounted(() => {
  websocketStore.leaveChannel('TaskIndexChannel')
})

/* ------------------------------ ACCESS NEEDED DATA ------------------------------- */
const task = computed<iTask>(() => {
  return new Task(tasksStore.item)
})

const columns = computed(() => {
  return columnsStore.items?.sort((a, b) => a.order - b.order)
})

const members = computed(() => {
  return membersStore.items?.filter((member) => checkIsEditor(member.role))
})

const taskComments = computed(() => {
  return task.value.comments || []
})

/* ------------------------------ INITIALIZE LOCAL STATE ------------------------------- */
const fieldsEditingState: {
  [key: string]: boolean
} = reactive({
  name: false,
  description: false,
  createdBy: false,
  assigneeId: false,
  projectColumnId: false,
  relation: false,
  comment: false,
})

const createFieldsValueState = <
  T extends Record<string, string | number | null>,
>(
  initialValues: T,
) => reactive(initialValues)

const fieldsValueState = createFieldsValueState({
  relationMode: '',
  relationId: null,
  comment: '',
})

const activeTab = ref<string>('comments')

const tabs = computed<iTab[]>(() => {
  return [
    {
      name: 'comments',
      label: t('tasks.comments'),
    },
    {
      name: 'history',
      label: t('tasks.history'),
    },
  ]
})

const tooltipConfig = computed(() => {
  return {
    value: t('tasks.dblClickToEdit'),
    showDelay: 1000,
  }
})

/* ------------------------------ LOCAL STATE SETTERS ------------------------------- */
/* - State management for the base inputs has been extracted from their components -- */
/* ----- this was done to enable potential manipulation from a parent component ----- */

const setFieldEditingState = ({
  key,
  value = true,
}: {
  key: string
  value: boolean
}) => {
  if (isViewer.value) return
  fieldsEditingState[key] = value
}

const updateFieldValue = ({ key, value }: { value: string; key: string }) => {
  ;(fieldsValueState as Record<string, string | number | null>)[key] = value
}

const setActiveTab = (tab: string) => {
  activeTab.value = tab
}

const dialogLeftPanelRef = ref<null | HTMLElement>(null)

const showCommentInput = async () => {
  if (isViewer.value) return
  fieldsEditingState.comment = true
  setTimeout(() => {
    if (dialogLeftPanelRef.value)
      dialogLeftPanelRef.value.scrollTop =
        dialogLeftPanelRef.value?.scrollHeight
  }, 100)
}

/* ------------------------------ FUNCTIONS ------------------------------- */

const submitFieldValue = async (key: string) => {
  try {
    const params = {
      [key]: fieldsValueState[key as keyof typeof fieldsValueState],
    }
    await tasksStore.updateItem(dialogItem.value.id, params)
    fieldsEditingState[key] = false
  } catch (error) {
    console.log(error)
  }
}

const deleteRelation = async () => {
  try {
    await tasksStore.updateItem(dialogItem.value.id, {
      relationMode: null,
      relationId: null,
    })
    fieldsEditingState.relation = false
  } catch (error) {
    console.log(error)
  }
}

const updateRelation = async () => {
  try {
    const params = {
      relationMode: fieldsValueState.relationMode,
      relationId: fieldsValueState.relationId,
    }
    fieldsEditingState.relation = false
    await tasksStore.updateItem(dialogItem.value.id, params)
    fieldsValueState.relationMode = ''
    fieldsValueState.relationId = null
  } catch (error) {
    console.log(error)
  }
}

const openRelatedTaskDialog = async ({
  taskId,
  redirected = false,
}: {
  taskId: number
  redirected?: boolean
}) => {
  try {
    const task: iTask = await tasksStore.fetchItem(taskId)

    if (task) {
      const params: DialogParams = {
        title: task?.name || t('tasks.task'),
        component: 'TaskDialog',
        item: task,
        hideHeader: true,
        size: '900px',
      }
      if (redirected) {
        params.item = { ...task, redirectedFromId: dialogItem.value.id }
      }
      layoutStore.openDialog(params)
    }
  } catch (error) {
    console.log(error)
  }
}

type taskCommentsRefType = {
  childRef: HTMLElement | null
}

const taskCommentsRef = ref<taskCommentsRefType | null>(null)

const addTaskComment = async () => {
  try {
    const regex = /<p><br><\/p>$/

    await tasksStore.updateItemWithSpecificAction(
      dialogItem.value.id,
      'comment',
      { content: fieldsValueState.comment.trimEnd().replace(regex, '') },
    )
    fieldsEditingState.comment = false
    fieldsValueState.comment = ''
    if (taskCommentsRef.value && taskCommentsRef.value.childRef)
      taskCommentsRef.value.childRef.scrollTop =
        taskCommentsRef.value.childRef?.scrollHeight
  } catch (error) {
    console.log(error)
  }
}

/* -------------------------------- UTILS --------------------------------- */
const getColumnName = (id: number) => {
  const column = columnsStore.items.find((column) => column.id === id)
  return column?.name || null
}
</script>

<template>
  <DialogTemplate hideActions>
    <!-- header -->
    <template #customHeader>
      <div class="flex align-items-center">
        <ArrowLeftIcon
          v-if="dialogItem.redirectedFromId"
          color="#6560ba"
          :size="15"
          class="mr-2"
          @click="
            openRelatedTaskDialog({ taskId: dialogItem.redirectedFromId })
          "
        />
        <span class="task__identifier mr-2">{{ task.identifier }}</span>
      </div>
    </template>
    <template #content>
      <div class="grid task__content-wrapper m-0">
        <!-- left panel -->
        <div
          ref="dialogLeftPanelRef"
          class="task flex flex-column col pt-2 pb-4 px-3"
        >
          <BaseDoubleClickInput
            :value="task.name"
            :isEditing="fieldsEditingState.name"
            :disabled="isViewer"
            valueKey="name"
            :label="$t('tasks.name')"
            :placeholder="$t('tasks.enterName')"
            :rules="[(value:string) => rules.required(value,$t('tasks.name')), (value:string) => rules.minLength(value, 5, $t('tasks.name')), (value:string) => rules.maxLength(value, 60, $t('tasks.name'))]"
            :tooltipConfig="tooltipConfig"
            @setEditingState="setFieldEditingState"
            @updateValue="updateFieldValue"
            @submitValue="submitFieldValue"
          />

          <span class="task__label p-2 mt-2">{{
            $t('tasks.description')
          }}</span>
          <BaseDoubleClickInput
            :value="task.description"
            :isEditing="fieldsEditingState.description"
            :disabled="isViewer"
            valueKey="description"
            :label="$t('tasks.description')"
            :placeholder="$t('tasks.enterDescription')"
            :maxLength="1000"
            :component="Editor"
            :tooltipConfig="tooltipConfig"
            medium
            :rules="[(value:string) => rules.maxLength(value, 1000,  $t('tasks.description'))]"
            @setEditingState="setFieldEditingState"
            @updateValue="updateFieldValue"
            @submitValue="submitFieldValue"
          />

          <ConnectedTask
            :relationId="fieldsValueState.relationId"
            :relationMode="fieldsValueState.relationMode"
            :disabled="isViewer"
            :isEditing="fieldsEditingState.relation"
            :dialogItem="dialogItem"
            :task="task"
            :relatedTask="task.relatedTask"
            :taskHasRelation="!!task.relatedTask?.id"
            @setEditingState="setFieldEditingState"
            @updateValue="updateFieldValue"
            @updateRelation="updateRelation"
            @deleteRelation="deleteRelation"
            @openRelatedTaskDialog="openRelatedTaskDialog"
          />

          <span class="task__label p-2 mt-2">{{ $t('tasks.activity') }}</span>
          <BaseButtonTabs
            :tabs="tabs"
            :activeTab="activeTab"
            @setActiveTab="setActiveTab"
          />

          <div v-if="activeTab === 'comments'" class="px-2 mt-2">
            <TaskComments ref="taskCommentsRef" :comments="taskComments" />
            <CommentInput
              :value="fieldsValueState.comment"
              :isEditing="fieldsEditingState.comment"
              @showCommentInput="showCommentInput"
              @setEditingState="setFieldEditingState"
              @updateValue="updateFieldValue"
              @submitValue="addTaskComment"
            />
          </div>

          <TaskHistory
            v-if="activeTab === 'history'"
            :history="task.history"
            class="mr-2"
          />
        </div>
        <!-- right panel -->
        <div
          class="task__side-bar col-fixed flex flex-column pt-2 pb-4 px-2"
          style="width: 300px"
        >
          <BaseDoubleClickSelect
            fieldKey="projectColumnId"
            class="mb-2"
            :label="$t('tasks.status')"
            :value="task.projectColumnId"
            :isEditing="fieldsEditingState.projectColumnId"
            :items="columns"
            :readonly="isViewer"
            :placeholder="$t('tasks.backlog')"
            :tooltipConfig="tooltipConfig"
            @setEditingState="setFieldEditingState"
            @updateFieldValue="updateFieldValue"
            @submitFieldValue="submitFieldValue"
          >
            <template #value
              >{{
                task?.projectColumnId
                  ? getColumnName(task?.projectColumnId)
                  : $t('tasks.backlog')
              }}
            </template>
          </BaseDoubleClickSelect>

          <BaseDoubleClickSelect
            fieldKey="assigneeId"
            :label="$t('tasks.assignee')"
            class="mb-2"
            :value="task?.assignee?.id"
            :isEditing="fieldsEditingState.assigneeId"
            :items="members"
            :readonly="isViewer"
            optionsValue="id"
            optionsLabel="fullName"
            :placeholder="$t('tasks.assignTask')"
            :tooltipConfig="tooltipConfig"
            @setEditingState="setFieldEditingState"
            @updateFieldValue="updateFieldValue"
            @submitFieldValue="submitFieldValue"
          >
            <template #value
              >{{ task?.assignee?.fullName || $t('tasks.notAssigned') }}
            </template>
          </BaseDoubleClickSelect>

          <BaseDoubleClickSelect
            :label="$t('tasks.createdBy')"
            class="mb-2"
            :value="task?.createdBy?.fullName"
            readonly
          />

          <BaseDoubleClickSelect
            :label="$t('tasks.createdDate')"
            class="mb-2"
            :value="task?.createdAt"
            readonly
          />
        </div>
      </div>
    </template>
  </DialogTemplate>
</template>

<style scoped lang="scss">
.task {
  max-height: 600px !important;
  overflow-y: scroll;
  color: #dfdcff;

  &__content-wrapper {
    max-width: 100%;
  }

  &__side-bar {
    background-color: #292938;
  }

  &__label {
    font-size: 14px;
    font-weight: 600;
  }

  &__identifier {
    font-size: 14px;
    font-weight: 600;
    color: #6560ba;
  }

  &::-webkit-scrollbar {
    width: 5px;
    height: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #6560ba;
  }

  &::-webkit-scrollbar-track {
    background: #2f2f3b;
  }
}

:deep(.p-input-icon-right) {
  width: 100%;
}

:deep(.p-inputtextarea) {
  width: 100% !important;
  &::-webkit-scrollbar {
    width: 5px;
    height: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #6560ba;
  }

  &::-webkit-scrollbar-track {
    background: #2f2f3b;
  }
}

:deep(.p-inputtext) {
  height: 35px !important;
  padding: 0.45rem 1.8rem 0.45rem 0.75rem !important;
}
</style>

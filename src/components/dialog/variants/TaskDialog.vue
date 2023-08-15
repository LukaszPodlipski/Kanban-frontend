<script setup lang="ts">
import {
  computed,
  onBeforeMount,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from 'vue'

import { Form } from 'vee-validate'

import { trimText } from '@/utils/functions'

import Editor from 'primevue/editor'
import DialogTemplate from '@/components/dialog/fragments/DialogTemplate.vue'
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon.vue'

import { useTasksStore } from '@/stores/tasks'
import { useColumnsStore } from '@/stores/columns'
import { useLayoutStore } from '@/stores/layout'
import { useWebsocketStore } from '@/stores/websocket'
import { useProjectStore } from '@/stores/project'
import { useMembersStore } from '@/stores/members'
import { useAuthStore } from '@/stores/auth'

import { iTask, iSimplifiedTask, Task } from '@/types/taskTypes'
import rules from '@/utils/validators'
import { relations } from '@/const'

const tasksStore = useTasksStore()
const columnsStore = useColumnsStore()
const projectStore = useProjectStore()
const layoutStore = useLayoutStore()
const websocketStore = useWebsocketStore()
const membersStore = useMembersStore()
const authStore = useAuthStore()

const dialogItem = computed<iTask & { redirectedFromId?: number }>(
  () => layoutStore.dialog.item,
)

const columns = computed(() => {
  return columnsStore.items
})

const members = computed(() => {
  return membersStore.items
})

const getColumnName = (id: number) => {
  const column = columnsStore.items.find((column) => column.id === id)
  return column?.name || null
}

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

const task = computed<iTask>(() => {
  return new Task(tasksStore.item)
})

const relatedTasksOptions = computed(() => {
  return tasksStore.items
    .filter((item) => item.id !== task.value.id)
    .map((task: iSimplifiedTask) => {
      const assiggnee = task.assignee?.fullName
        ? ` - ${task.assignee?.fullName || ''}`
        : ''
      return {
        label: `${task.identifier}: ${trimText(task.name, 15)} ${trimText(
          assiggnee,
          15,
        )}`,
        id: task.id,
      }
    })
})

const relatedTask = computed<iSimplifiedTask | null>(() => {
  return (
    tasksStore.items.find((item) => item.id === task.value.relationId) || null
  )
})

const tabsState: {
  [key: string]: boolean
} = reactive({
  comments: true,
  history: false,
})

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

const fieldsValueState: {
  [key: string]: string | null
} = reactive({
  relationMode: '',
  relationId: null,
  comment: null,
})

const updateFieldValue = (value: string, key: string) => {
  fieldsValueState[key] = value
}

const submitFieldValue = async (key: string) => {
  try {
    const params = {
      [key]: fieldsValueState[key],
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

type DialogParams = {
  title: string
  component: string
  item: iTask & { redirectedFromId?: number }
  hideHeader: boolean
  size: string
}

const openRelatedTaskDialog = (taskId: number, redirected: boolean = false) => {
  const task: iTask = tasksStore.items.find(
    (item) => item.id === taskId,
  ) as iTask
  if (task) {
    const params: DialogParams = {
      title: task?.name || 'Task',
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
}

const closeRelationEditingState = () => {
  if (fieldsEditingState.relation) {
    fieldsEditingState.relation = false
    fieldsValueState.relationMode = ''
    fieldsValueState.relationId = null
  } else {
    fieldsEditingState.relation = true
  }
}

const setActiveTab = (tab: string) => {
  Object.keys(tabsState).forEach((t) => {
    tabsState[t] = false
  })
  tabsState[tab] = true
}

const dialogLeftPanelRef = ref<null | HTMLElement>(null)

const showCommentInput = async () => {
  fieldsEditingState.comment = true
  setTimeout(() => {
    if (dialogLeftPanelRef.value)
      dialogLeftPanelRef.value.scrollTop =
        dialogLeftPanelRef.value?.scrollHeight
  }, 100)
}

const taskCommentsRef = ref<null | HTMLElement>(null)

const addTaskComment = async () => {
  try {
    await tasksStore.updateItemWithSpecificAction(
      dialogItem.value.id,
      'comment',
      { content: fieldsValueState.comment },
    )
    fieldsEditingState.comment = false
    fieldsValueState.comment = ''
    if (taskCommentsRef.value)
      taskCommentsRef.value.scrollTop = taskCommentsRef.value?.scrollHeight
  } catch (error) {
    console.log(error)
  }
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
          @click="openRelatedTaskDialog(dialogItem.redirectedFromId)"
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
          <div
            class="task__title p-2"
            :class="{ task__field: !fieldsEditingState.name }"
            @dblclick="fieldsEditingState.name = true"
          >
            <span v-if="!fieldsEditingState.name">{{ task.name }}</span>
            <Form v-slot="{ errors }" v-else>
              <BaseInput
                :value="task.name"
                label="Name"
                placeholder="Enter name"
                :floatLabel="false"
                @update:modelValue="(value:string) => updateFieldValue(value, 'name')"
                :rules="[(value:string) => rules.required(value,'Name'), (value:string) => rules.minLength(value, 5, 'Name'), (value:string) => rules.maxLength(value, 60, 'Name')]"
              >
                <template #append>
                  <div class="mt-1">
                    <BaseButton
                      @click="submitFieldValue('name')"
                      icon="check"
                      small
                      :disabled="Object.keys(errors).length > 0"
                    />
                    <BaseButton
                      icon="times"
                      class="ml-2"
                      small
                      @click="fieldsEditingState.name = false"
                      :disabled="Object.keys(errors).length > 0"
                    /></div></template
              ></BaseInput>
            </Form>
          </div>
          <span class="task__label p-2 mt-2">Description</span>
          <div
            class="p-2"
            :class="{ task__field: !fieldsEditingState.description }"
            @dblclick="fieldsEditingState.description = true"
          >
            <span
              v-if="!fieldsEditingState.description"
              v-html="task.description"
              class="task__description task__description--readonly"
            />
            <Form v-slot="{ errors }" v-else>
              <BaseInput
                :value="task.description"
                label="Description"
                placeholder="Describe new task"
                :maxLength="1000"
                :floatLabel="false"
                :component="Editor"
                @update:modelValue="(value:string) => updateFieldValue(value, 'description')"
                :rules="[(value:string) => rules.required(value,'Description'), (value:string) => rules.maxLength(value, 1000, 'Description')]"
              >
                <template #append>
                  <div class="mt-1">
                    <BaseButton
                      @click="submitFieldValue('description')"
                      icon="check"
                      small
                      :disabled="Object.keys(errors).length > 0"
                    />
                    <BaseButton
                      icon="times"
                      class="ml-2"
                      small
                      @click="fieldsEditingState.description = false"
                    />
                  </div>
                </template>
              </BaseInput>
            </Form>
          </div>
          <div class="flex justify-content-between align-items-center p-2 mt-2">
            <span class="task__label">Connected tasks</span>
            <i
              v-if="!task.relationId"
              class="pi cursor-pointer"
              :class="{
                'pi-plus': !fieldsEditingState.relation,
                'pi-times': fieldsEditingState.relation,
              }"
              style="font-size: 0.8rem"
              @click.native="closeRelationEditingState"
            ></i>
          </div>
          <Form
            v-if="fieldsEditingState.relation"
            v-slot="{ resetField, errors }"
          >
            <div class="flex gap-2 px-2">
              <div
                class="flex flex-column justify-content-center"
                :style="{ width: '130px !important' }"
              >
                <BaseSelect
                  v-model="fieldsValueState.relationMode"
                  :items="relations"
                  label="RelationMode"
                  fieldName="relationMode"
                  placeholder="Type"
                  :hide-dropdown-icon="true"
                  :rules="[(value:string) => fieldsValueState.relationId ? rules.required(value,'Relation') : true]"
                  @cleared="
                    !fieldsValueState.relationId
                      ? resetField('relatedTaskField')
                      : null
                  "
                />
              </div>
              <div class="flex flex-column flex-1 justify-content-center">
                <BaseSelect
                  v-model="fieldsValueState.relationId"
                  :items="relatedTasksOptions"
                  label="RelatedTask"
                  fieldName="relatedTask"
                  optionsValue="id"
                  optionsLabel="label"
                  :placeholder="`Select ${
                    fieldsValueState.relationMode
                      ? fieldsValueState.relationMode.toLowerCase()
                      : ''
                  } task`"
                  :rules="[(value:string) => fieldsValueState.relationMode ? rules.required(value,'Related task') : true]"
                  @cleared="
                    !fieldsValueState.relationMode
                      ? resetField('relationModeField')
                      : null
                  "
                />
              </div>
              <div class="flex justify-content-center">
                <BaseButton
                  icon="check"
                  medium
                  :disabled="
                    Object.keys(errors).length > 0 ||
                    !fieldsValueState.relationId ||
                    !fieldsValueState.relationMode
                  "
                  @click="updateRelation"
                />
              </div>
            </div>
          </Form>
          <div
            v-if="task.relationId"
            class="task__field task__relation flex justify-content-between align-items-center p-2 mx-2"
            @click="openRelatedTaskDialog(task.relationId, true)"
          >
            <span>{{ task.relationMode }}</span>
            <div class="flex align-items-center justify-content-center">
              <span class="mr-2">{{ relatedTask?.identifier }}</span>
              <span class="mr-2">{{ trimText(relatedTask?.name, 20) }}</span>
              <span>{{ trimText(relatedTask?.assignee?.fullName, 20) }}</span>
              <i
                class="pi pi-times ml-4"
                style="font-size: 0.8rem"
                @click.stop="deleteRelation"
              ></i>
            </div>
          </div>
          <span class="task__label p-2 mt-2">Activity</span>
          <div class="p-2 flex">
            <span
              class="task__tab mr-2"
              :class="{ 'task__tab--active': tabsState.comments }"
              @click="setActiveTab('comments')"
              >Comments</span
            >
            <span
              class="task__tab"
              :class="{ 'task__tab--active': tabsState.history }"
              @click="setActiveTab('history')"
              >History</span
            >
          </div>
          <div v-if="tabsState.comments" class="px-2 mt-2">
            <div ref="taskCommentsRef" class="task__comments mb-2">
              <div
                v-for="comment in task.comments"
                :key="comment.id"
                class="comment flex mb-2 align-items-start"
              >
                <img
                  :src="comment.user.avatarUrl"
                  class="comment__avatar mr-3"
                />
                <div class="comment__content flex flex-column py-2 px-3">
                  <span class="comment__user">{{
                    comment.user?.fullName
                  }}</span>
                  <span v-html="comment.content" class="comment__text mt-1" />
                </div>
              </div>
            </div>
            <div class="comment-input-wrapper flex align-items-start">
              <img
                :src="authStore.user.avatarUrl"
                class="comment-input-wrapper__avatar mr-3"
              />
              <div
                v-if="!fieldsEditingState.comment"
                class="comment-input-wrapper__placeholder py-2 px-3 flex-1"
                @dblclick="showCommentInput"
              >
                <span>Add new comment</span>
              </div>
              <Form class="flex-1" v-else v-slot="{ errors }">
                <BaseInput
                  :value="fieldsValueState.comment"
                  label="Comment"
                  placeholder="Add new comment"
                  :maxLength="1000"
                  :floatLabel="false"
                  :component="Editor"
                  @update:modelValue="(value:string) => updateFieldValue(value, 'comment')"
                  :rules="[(value:string) => rules.maxLength(value, 1000, 'Description')]"
                >
                  <template #append>
                    <div class="mt-1">
                      <BaseButton
                        icon="check"
                        small
                        :disabled="
                          Object.keys(errors).length > 0 ||
                          !fieldsValueState.comment
                        "
                        @click="addTaskComment"
                      />
                      <BaseButton
                        icon="times"
                        class="ml-2"
                        small
                        @click="fieldsEditingState.comment = false"
                      />
                    </div>
                  </template>
                </BaseInput>
              </Form>
            </div>
          </div>
          <div v-if="tabsState.history" class="task__history px-2 pt-3">
            <div
              v-for="log in task.history"
              class="log flex align-items-start mb-3"
            >
              <img class="log__avatar mr-3" :src="log.user.avatarUrl" />
              <div class="flex flex-column">
                <div class="flex">
                  <span class="log__user mr-2">{{ log.user.fullName }}</span>
                  <span class="log__date">{{ log.createdAt }}</span>
                </div>
                <span class="log__text mt-1">{{ log.text }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- right panel -->
        <div
          class="task__side-bar col-fixed flex flex-column pt-2 pb-4 px-2"
          style="width: 300px"
        >
          <span class="task__label p-2">Status</span>
          <span
            v-if="!fieldsEditingState.projectColumnId"
            class="task__field p-2"
            @dblclick="fieldsEditingState.projectColumnId = true"
            >{{
              task?.projectColumnId
                ? getColumnName(task?.projectColumnId)
                : 'Backlog'
            }}</span
          >
          <Form v-slot="{ errors }" v-else class="mx-2">
            <BaseSelect
              :value="task.projectColumnId"
              :items="columns"
              label="Status"
              optionsValue="id"
              optionsLabel="name"
              placeholder="Set task status"
              @update:modelValue="(value:string) => updateFieldValue(value, 'projectColumnId')"
            >
              <template #append>
                <div class="mt-2">
                  <BaseButton
                    @click="submitFieldValue('projectColumnId')"
                    icon="check"
                    small
                    :disabled="Object.keys(errors).length > 0"
                  />
                  <BaseButton
                    icon="times"
                    class="ml-2"
                    small
                    @click="fieldsEditingState.projectColumnId = false"
                    :disabled="Object.keys(errors).length > 0"
                  />
                </div>
              </template>
            </BaseSelect>
          </Form>
          <span class="task__label p-2">Assignee</span>
          <span
            v-if="!fieldsEditingState.assigneeId"
            class="task__field p-2"
            @dblclick="fieldsEditingState.assigneeId = true"
            >{{ task?.assignee?.fullName || 'Not assigned' }}</span
          >
          <Form v-else v-slot="{ errors }" class="mx-2">
            <BaseSelect
              :value="task.assignee.id"
              :items="members"
              label="Assignee"
              optionsValue="id"
              optionsLabel="fullName"
              placeholder="Assign task to member"
              @update:modelValue="(value:string) => updateFieldValue(value, 'assigneeId')"
            >
              <template #append>
                <div class="mt-2">
                  <BaseButton
                    @click="submitFieldValue('assigneeId')"
                    icon="check"
                    small
                    :disabled="Object.keys(errors).length > 0"
                  />
                  <BaseButton
                    icon="times"
                    class="ml-2"
                    small
                    @click="fieldsEditingState.assigneeId = false"
                    :disabled="Object.keys(errors).length > 0"
                  />
                </div>
              </template>
            </BaseSelect>
          </Form>
          <span class="task__label p-2">Created by</span>
          <span class="p-2">{{ task?.createdBy?.fullName }}</span>
          <span class="task__label p-2">Created date</span>
          <span class="p-2">{{ task?.createdAt }}</span>
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

  &__field {
    &:hover {
      background-color: #2424307c;
      cursor: pointer;
    }
  }

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
    font-size: 12px;
    font-weight: 600;
    color: #6560ba;
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
    border-radius: 4px;
  }

  &__description {
    font-size: 16px;
    border-radius: 4px;
  }

  &__relation {
    border: 1px solid #6460ba6d;
  }

  &__comments,
  &__history {
    max-height: 200px;
    overflow-y: scroll;

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

  &__history {
    max-height: 245px;
  }

  &__tab {
    padding: 4px 8px;
    border-radius: 4px;
    background-color: #292938;
    font-size: 12px;

    &:hover {
      background-color: #2f2f3b;
      cursor: pointer;
    }

    &--active {
      background-color: #6560ba;

      &:hover {
        background-color: #6560ba;
        cursor: pointer;
      }
    }
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

.comment {
  &__content {
    background-color: #23232f;
    border-radius: 8px;
  }
  &__avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  &__user {
    font-size: 12px;
    font-weight: 600;
  }
  &__text {
    font-size: 14px;
  }
}
.comment-input-wrapper {
  font-size: 12px;
  &__placeholder {
    background-color: #23232f;
    border-radius: 4px;
  }
  &__avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
}

.log {
  &__avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  &__user,
  &__date {
    font-size: 12px;
    font-weight: 600;
  }
  &__text {
    font-size: 14px;
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
  padding: 0.45rem 0.75rem !important;
}
</style>

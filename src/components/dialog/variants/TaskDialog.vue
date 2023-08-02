<script setup lang="ts">
import { computed, onBeforeMount, onMounted, onUnmounted, reactive } from 'vue'
import Editor from 'primevue/editor'
import rules from '@/utils/validators'
import { Form } from 'vee-validate'
import { trimText } from '@/utils/functions'

import DialogTemplate from '@/components/dialog/fragments/DialogTemplate.vue'

import { useTasksStore } from '@/stores/tasks'
import { useColumnsStore } from '@/stores/columns'
import { useLayoutStore } from '@/stores/layout'
import { useWebsocketStore } from '@/stores/websocket'
import { useProjectStore } from '@/stores/project'
import { useMembersStore } from '@/stores/members'

import { iTask, iSimplifiedTask } from '@/types/taskTypes'

const tasksStore = useTasksStore()
const columnsStore = useColumnsStore()
const projectStore = useProjectStore()
const layoutStore = useLayoutStore()
const websocketStore = useWebsocketStore()
const membersStore = useMembersStore()

const dialogItem = computed<iTask>(() => layoutStore.dialog.item)

const columns = computed(() => {
  return columnsStore.items
})

const members = computed(() => {
  return membersStore.items
})

const getColumnName = (id: number) => {
  const column = columnsStore.items.find((column) => column.id === id)
  return column?.name
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

onUnmounted(() => {
  websocketStore.leaveChannel('TaskIndexChannel')
})

const task = computed<iTask>(() => {
  return tasksStore.item
})

const relatedTask = computed<iSimplifiedTask | null>(() => {
  return (
    tasksStore.items.find((item) => item.id === task.value.relationId) || null
  )
})

const fieldsEditingState: {
  [key: string]: boolean
} = reactive({
  name: false,
  description: false,
  createdBy: false,
  assigneeId: false,
  projectColumnId: false,
})

const fieldsValueState: {
  [key: string]: string
} = reactive({})

const updateFieldValue = (value: string, key: string) => {
  console.log(value, key)
  fieldsValueState[key] = value
}

const submitFieldValue = async (key: string) => {
  console.log('key: ', key, 'value: ', fieldsValueState[key])
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
</script>

<template>
  <DialogTemplate hideActions>
    <template #customHeader>
      <div class="flex align-items-center">
        <span class="task__identifier mr-2">{{ task.identifier }}</span>
      </div>
    </template>
    <template #content>
      <div class="grid task__content-wrapper m-0">
        <div class="task flex flex-column col pt-2 pb-4 px-3">
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
                :rules="[(value:string) => rules.required(value,'Name'), (value:string) => rules.minLength(value, 5, 'Name'), (value:string) => rules.maxLength(value, 20, 'Name')]"
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
                    />
                  </div> </template
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
                      :disabled="Object.keys(errors).length > 0"
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
              class="pi pi-plus"
              style="font-size: 0.6rem"
            ></i>
          </div>
          <div
            v-if="task.relationId"
            class="task__field task__relation flex justify-content-between align-items-center p-2 mx-2"
          >
            <span>{{ task.relationMode }}</span>
            <div>
              <span>{{ relatedTask?.identifier }} - </span>
              <span>{{ trimText(relatedTask?.name, 20) }} - </span>
              <span>{{ trimText(relatedTask?.assignee.fullName, 20) }}</span>
            </div>
          </div>
          <span class="task__label p-2 mt-2">Activity</span>
          <div class="p-2 flex">
            <span class="task__tab mr-2">Comments</span>
            <span class="task__tab">History</span>
          </div>
        </div>
        <div
          class="task__side-bar col-fixed flex flex-column pt-2 pb-4 px-2"
          style="width: 300px"
        >
          <span class="task__label p-2">Status</span>
          <span
            v-if="!fieldsEditingState.projectColumnId"
            class="task__field p-2"
            @dblclick="fieldsEditingState.projectColumnId = true"
            >{{ getColumnName(task?.projectColumnId) }}</span
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
            >{{ task?.assignee?.fullName }}</span
          >
          <Form v-slot="{ errors }" v-else class="mx-2">
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
        </div>
      </div>
    </template>
  </DialogTemplate>
</template>

<style scoped lang="scss">
.task {
  max-height: 800px !important;
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
    border: 1px solid #6560ba;
  }

  &__tab {
    padding: 4px 8px;
    border-radius: 4px;
    background-color: #292938;

    &:hover {
      background-color: #2f2f3b;
      cursor: pointer;
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

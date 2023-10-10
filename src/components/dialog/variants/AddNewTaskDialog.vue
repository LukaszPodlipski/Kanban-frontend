<script setup lang="ts">
import { computed, ref, Ref } from 'vue'
import { Form, useForm } from 'vee-validate'
import DialogTemplate from '@/components/dialog/fragments/DialogTemplate.vue'
import Editor from 'primevue/editor'
import rules from '@/utils/validators'
import { useColumnsStore } from '@/stores/columns'
import { useMembersStore } from '@/stores/members'
import { useTasksStore } from '@/stores/tasks'
import { useLayoutStore } from '@/stores/layout'
import { iSimplifiedTask } from '@/types/taskTypes'
import { trimText } from '@/utils/functions'
import { relations } from '@/const'

const { errors } = useForm()

const name: Ref<string> = ref('')
const description: Ref<string> = ref('')
const projectColumnId: Ref<number | null> = ref(null)
const assigneeId: Ref<number | null> = ref(null)
const relationMode: Ref<string> = ref('')
const relationId: Ref<number | null> = ref(null)

const columnsStore = useColumnsStore()
const membersStore = useMembersStore()
const tasksStore = useTasksStore()
const layoutStore = useLayoutStore()

const columns = computed(() => {
  return columnsStore.items
})

const members = computed(() => {
  return membersStore.items
})

const tasks = computed(() => {
  return tasksStore.items.map((task: iSimplifiedTask) => {
    const assiggnee = task.assignee?.fullName
      ? ` - ${task.assignee?.fullName || ''}`
      : ''
    const name = trimText(task.name, 20)
    return {
      label: `${task.identifier}: ${name} ${assiggnee}`,
      id: task.id,
    }
  })
})

const formIsValid = computed(() => {
  return (
    Object.keys(errors.value).length === 0 &&
    !!name.value.length &&
    !!description.value.length &&
    (!relationId.value || (!!relationId.value && !!relationMode.value)) &&
    (!relationMode.value || (!!relationMode.value && !!relationId.value))
  )
})

const addTask = async () => {
  const params = {
    name: name.value,
    description: description.value,
    projectColumnId: projectColumnId.value,
    assigneeId: assigneeId.value,
    relationId: relationId.value,
    relationMode: relationMode.value,
  }
  try {
    await tasksStore.createItem(params)
    layoutStore.closeDialog()
    layoutStore.showToast({ message: 'Task created successfully' })
  } catch (error: any) {
    layoutStore.showToast({
      message: error.response.data.error,
      type: 'error',
    })
    console.log('error: ', error)
  }
}
</script>

<template>
  <Form v-slot="{ resetField }">
    <form @submit.prevent="addTask" class="flex flex-column gap-2">
      <DialogTemplate>
        <template #content>
          <div class="flex flex-column flex-wrap px-4 pt-4">
            <span class="field-label">Name</span>
            <BaseInput
              v-model="name"
              label="Name"
              placeholder="Enter name"
              :floatLabel="false"
              :rules="[(value:string) => rules.required(value,'Name'), (value:string) => rules.minLength(value, 5, 'Name'), (value:string) => rules.maxLength(value, 60, 'Name')]"
            />
            <span class="field-label">Description</span>
            <BaseInput
              v-model="description"
              label="Description"
              placeholder="Describe new task"
              :maxLength="1000"
              :floatLabel="false"
              :component="Editor"
              :rules="[(value:string) => rules.required(value,'Description'), (value:string) => rules.maxLength(value, 1000, 'Description')]"
            />
            <div class="flex gap-4  mt-3">
              <div class="flex flex-column flex-1 justify-content-center">
                <span class="field-label">Status (by default backlog)</span>
                <BaseSelect
                  v-model="projectColumnId"
                  :items="columns"
                  label="Status"
                  optionsValue="id"
                  optionsLabel="name"
                  placeholder="Set task status"
                />
              </div>
              <div class="flex flex-column flex-1 justify-content-center">
                <span class="field-label">Assignee</span>
                <BaseSelect
                  v-model="assigneeId"
                  :items="members"
                  label="Assignee"
                  optionsValue="id"
                  optionsLabel="fullName"
                  placeholder="Assign task to member"
                />
              </div>
            </div>
            <div class="flex flex-column mt-3">
              <span class="field-label">Relation (optional)</span>
              <div class="flex gap-2">
                <div
                  class="flex flex-column justify-content-center"
                  :style="{ width: '120px !important' }"
                >
                  <BaseSelect
                    v-model="relationMode"
                    :items="relations"
                    label="RelationMode"
                    fieldName="relationMode"
                    placeholder="Type"
                    :hide-dropdown-icon="true"
                    :rules="[(value:string) => relationId ? rules.required(value,'Relation') : true]"
                    @cleared="
                      !relationId ? resetField('relatedTaskField') : null
                    "
                  />
                </div>
                <div class="flex flex-column flex-1 justify-content-center">
                  <BaseSelect
                    v-model="relationId"
                    :items="tasks"
                    label="RelatedTask"
                    fieldName="relatedTask"
                    optionsValue="id"
                    optionsLabel="label"
                    :placeholder="`Select ${
                      relationMode ? relationMode.toLowerCase() : ''
                    } task`"
                    :rules="[(value:string) => relationMode ? rules.required(value,'Related task') : true]"
                    @cleared="
                      !relationMode ? resetField('relationModeField') : null
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #actions>
          <BaseButton
            type="submit"
            label="Add"
            icon="check"
            :disabled="!formIsValid"
          />
        </template>
      </DialogTemplate>
    </form>
  </Form>
</template>

<style scoped lang="scss">
.field-label {
  margin-bottom: 8px;
}

:deep(.p-inputtextarea) {
  height: 200px !important;
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
</style>

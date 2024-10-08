<script setup lang="ts">
import DialogTemplate from '@/components/layout/dialog/DialogTemplate.vue'
import usePermittedUser from '@/composables/usePermittedUser'
import { relations } from '@/const'
import { useColumnsStore } from '@/stores/columns'
import { useLayoutStore } from '@/stores/layout'
import { useMembersStore } from '@/stores/members'
import { useTasksStore } from '@/stores/tasks'
import { iSimplifiedTask } from '@/types/taskTypes'
import { trimText } from '@/utils/functions'
import rules from '@/utils/validators'
import Editor from 'primevue/editor'
import { Form, useForm } from 'vee-validate'
import { computed, ref, Ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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
const { checkIsEditor } = usePermittedUser()

const columns = computed(() => {
  return columnsStore.items?.sort((a, b) => a.order - b.order)
})

const members = computed(() => {
  return membersStore.items?.filter((member) => checkIsEditor(member.role))
})

const loading = computed(() => {
  return tasksStore.loadingItem
})

const tasks = computed(() => {
  return tasksStore.items
    ?.sort((a, b) => a.id - b.id)
    ?.map((task: iSimplifiedTask) => {
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
    layoutStore.showToast({ message: t('tasks.createdSuccesfully') })
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
      <DialogTemplate :loading="loading">
        <template #content>
          <div class="flex flex-column flex-wrap px-4 pt-4">
            <span class="field-label">{{ $t('tasks.name') }}</span>
            <BaseInput
              v-model="name"
              :label="$t('tasks.name')"
              :placeholder="$t('tasks.enterName')"
              :floatLabel="false"
              :disabled="loading"
              :rules="[(value:string) => rules.required(value,'Name'), (value:string) => rules.minLength(value, 5, 'Name'), (value:string) => rules.maxLength(value, 60, 'Name')]"
            />
            <span class="field-label">{{ $t('tasks.description') }}</span>
            <BaseInput
              :value="description"
              :label="$t('tasks.description')"
              :placeholder="$t('tasks.enterDescription')"
              :maxLength="1000"
              :floatLabel="false"
              :component="Editor"
              :disabled="loading"
              :rules="[(value:string) => rules.maxLength(value, 1000, t('tasks.description'))]"
              @update:modelValue="description = $event"
              />
            <div class="flex gap-4 mt-3">
              <div class="flex flex-column flex-1 justify-content-center">
                <span class="field-label">{{
                  $t('tasks.statusByDefaultBacklog')
                }}</span>
                <BaseSelect
                  v-model="projectColumnId"
                  :items="columns"
                  :label="$t('tasks.status')"
                  optionsValue="id"
                  optionsLabel="name"
                  :disabled="loading"
                  :placeholder="$t('tasks.setStatus')"
                />
              </div>
              <div class="flex flex-column flex-1 justify-content-center">
                <span class="field-label">{{ $t('tasks.assignee') }}</span>
                <BaseSelect
                  v-model="assigneeId"
                  :items="members"
                  :label="$t('tasks.assignee')"
                  optionsValue="id"
                  optionsLabel="fullName"
                  :disabled="loading"
                  :placeholder="$t('tasks.assignTask')"
                />
              </div>
            </div>
            <div class="flex flex-column mt-3">
              <span class="field-label">{{
                $t('tasks.optionalRelation')
              }}</span>
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
                    :placeholder="$t('tasks.type')"
                    :hide-dropdown-icon="true"
                    :disabled="loading"
                    :rules="[(value:string) => relationId ? rules.required(value,$t('tasks.relation')) : true]"
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
                    :disabled="loading"
                    :placeholder="
                      $t('tasks.selectXtask', {
                        type: relationMode ? relationMode.toLowerCase() : '',
                      })
                    "
                    :rules="[(value:string) => relationMode ? rules.required(value,$t('tasks.relatedTask')) : true]"
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
            :label="$t('tasks.add')"
            icon="check"
            :disabled="!formIsValid || loading"
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
    background: $primary-base;
  }

  &::-webkit-scrollbar-track {
    background: $grayscale-darken5;
  }
}
</style>

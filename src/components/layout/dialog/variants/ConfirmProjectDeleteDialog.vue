<script setup lang="ts">
import DialogTemplate from '@/components/layout/dialog/DialogTemplate.vue'
import router from '@/router'
import { useLayoutStore } from '@/stores/layout'
import { useProjectStore } from '@/stores/project'
import { useProjectsStore } from '@/stores/projects'
import rules from '@/utils/validators'
import InlineMessage from 'primevue/inlinemessage'
import { Form, useForm } from 'vee-validate'
import { computed, ref, Ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { errors } = useForm()
const { t } = useI18n()

const projectStore = useProjectStore()
const projectsStore = useProjectsStore()
const layoutStore = useLayoutStore()

const loading = computed(() => {
  return projectsStore.loadingItem
})

const project = computed(() => projectStore.project)

const formIsValid = computed(() => {
  return Object.keys(errors.value).length === 0 && projectNameValue.value.length
})

const projectNameValue: Ref<string> = ref('')

const deleteProject = async () => {
  try {
    layoutStore.closeDialog()
    await projectsStore.deleteItem(projectStore.project?.id as number)
    router.push({ name: 'Explore' })
    layoutStore.showToast({
      message: t('settings.dangerZone.projectDeleteSuccess'),
      type: 'success',
    })
  } catch (err) {
    layoutStore.showToast({
      message: t('settings.dangerZone.projectDeleteError'),
      type: 'error',
    })
  }
}
</script>

<template>
  <form @submit.prevent="deleteProject" class="flex flex-column gap-2">
    <DialogTemplate :loading="loading">
      <template #content>
        <div class="px-4">
          <div class="mb-3">
            <span class="mr-1"
              >{{ $t('settings.dangerZone.enterProjectName') }}:
            </span>
            <span class="font-medium text-teal-500">"{{ project?.name }}"</span>
          </div>
          <div class="w-full">
            <BaseInput
              v-model="projectNameValue"
              label="projectNameField"
              :disabled="loading"
              :placeholder="$t('settings.dangerZone.projectName')"
              :floatLabel="false"
              :rules="[()=>rules.isExact(projectNameValue, project?.name as string)]"
            />
            <InlineMessage severity="warn">{{
              $t('settings.dangerZone.description')
            }}</InlineMessage>
          </div>
        </div>
      </template>
      <template #actions>
        <BaseButton
          type="submit"
          :label="$t('settings.dangerZone.deleteProject')"
          icon="check"
          :disabled="!formIsValid"
        />
      </template>
    </DialogTemplate>
  </form>
</template>

<style scoped lang="scss">
:deep(.p-input-icon-right) {
  width: 100%;
}
</style>

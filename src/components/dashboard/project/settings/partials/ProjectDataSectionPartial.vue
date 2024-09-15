<script setup lang="ts">
import usePermittedUser from '@/composables/usePermittedUser'
import { useLayoutStore } from '@/stores/layout'
import { useProjectStore } from '@/stores/project'
import { useProjectsStore } from '@/stores/projects'
import { Form } from 'vee-validate'
import { computed, onMounted, Ref, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import ProjectDataInput from '../inputs/ProjectDataInput.vue'
import SettingsSectionTemplate from './SettingsSectionTemplate.vue'

/* -------------------------------- USE REQUIRED COMPOSABLES --------------------------------- */
const projectStore = useProjectStore()
const projectsStore = useProjectsStore()
const layoutStore = useLayoutStore()

const { isAdmin } = usePermittedUser()
const { t } = useI18n()

/* ---------------------------------- INITIALIZE LOCAL DATA ---------------------------------- */
const projectData: Ref<{ name: string; description: string; prefix: string }> =
  ref({
    name: '',
    description: '',
    prefix: '',
  })

const initialProjectData: Ref<{
  name: string
  description: string
  prefix: string
}> = ref({
  name: '',
  description: '',
  prefix: '',
})

/* ------------------------------------ GET PROJECT DATA -------------------------------------- */
onMounted(async () => {
  try {
    if (!projectStore.projectData) await projectStore.getItem()
    setProjectDataEntryValues()
  } catch (e) {
    console.log(e)
  }
})

/* ---------------------------------------- COMPUTED ------------------------------------------ */
const isChangeInData = computed(() => {
  return (
    JSON.stringify(initialProjectData.value) !==
    JSON.stringify(projectData.value)
  )
})

const isLoading = computed(() => {
  return projectStore.loading
})

/* ---------------------------------------- FUNCTIONS ----------------------------------------- */
const setProjectDataEntryValues = () => {
  const { name, description, prefix } = projectStore.projectData || {}

  projectData.value.name = name || ''
  projectData.value.description = description || ''
  projectData.value.prefix = prefix || ''

  initialProjectData.value.name = name || ''
  initialProjectData.value.description = description || ''
  initialProjectData.value.prefix = prefix || ''
}

const restoreProjectdata = () => {
  projectData.value.name = initialProjectData.value.name
  projectData.value.description = initialProjectData.value.description
  projectData.value.prefix = initialProjectData.value.prefix
}

const updateProjectData = async () => {
  try {
    const payload = {
      name: projectData.value.name,
      description: projectData.value.description,
    }

    await projectStore.updateProject(payload)

    layoutStore.showToast({
      message: t('settings.projectData.projectDataUpdateSuccess'),
      type: 'success',
    })

    await projectStore.getItem()
    await projectsStore.getItems()
    setProjectDataEntryValues()
  } catch (e) {
    console.error(e)

    layoutStore.showToast({
      message: t('settings.projectData.projectDataUpdateError'),
      type: 'error',
    })
  }
}
</script>

<template>
  <Form v-slot="{ errors }">
    <form @submit.prevent="updateProjectData">
      <SettingsSectionTemplate :loading="projectStore.loading">
        <template #header>
          <span class="title">{{ $t('settings.projectData.title') }}</span>
          <div class="flex gap-4">
            <BaseButton
              :label="$t('settings.columns.restoreInitialState')"
              icon="replay"
              :disabled="!isChangeInData || isLoading || !isAdmin"
              @click="restoreProjectdata"
            />
            <BaseButton
              type="submit"
              :label="$t('settings.columns.saveChanges')"
              :icon="!Object.keys(errors).length ? 'check' : 'times'"
              :disabled="
                Object.keys(errors).length ||
                !isChangeInData ||
                isLoading ||
                !isAdmin
              "
            />
          </div>
        </template>
        <template #content>
          <div class="project-data-wrapper pt-4 pb-4 px-5">
            <ProjectDataInput
              v-model:name="projectData.name"
              v-model:description="projectData.description"
              v-model:prefix="projectData.prefix"
              :isEditing="true"
            />
          </div>
        </template>
      </SettingsSectionTemplate>
    </form>
  </Form>
</template>

<style scoped lang="scss">
:deep(.p-inputtext:not(.p-colorpicker-preview):not(.p-inputtextarea)) {
  height: 40px !important;
}
.field-label {
  margin-bottom: 8px;
}

.project-data-wrapper {
  background-color: $grayscale-darken3;
}

.content {
  background-color: $grayscale-darken3;
}
</style>

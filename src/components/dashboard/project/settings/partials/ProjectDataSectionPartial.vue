<script setup lang="ts">
import usePermittedUser from '@/composables/usePermittedUser'
import { useLayoutStore } from '@/stores/layout'
import { useProjectStore } from '@/stores/project'
import rules from '@/utils/validators'
import { Form } from 'vee-validate'
import { computed, onMounted, Ref, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import SettingsSectionTemplate from './SettingsSectionTemplate.vue'

/* -------------------------------- USE REQUIRED COMPOSABLES --------------------------------- */
const projectStore = useProjectStore()
const layoutStore = useLayoutStore()

const { isAdmin } = usePermittedUser()
const { t } = useI18n()

/* ---------------------------------- INITIALIZE LOCAL DATA ---------------------------------- */
const projectData: Ref<{ name: string; description: string }> = ref({
  name: '',
  description: '',
})

const initialProjectData: Ref<{ name: string; description: string }> = ref({
  name: '',
  description: '',
})

/* ------------------------------------ GET PROJECT DATA -------------------------------------- */
onMounted(async () => {
  try {
    await projectStore.getItem()
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
  const { name, description } = projectStore.projectData || {}

  projectData.value.name = name || ''
  projectData.value.description = description || ''

  initialProjectData.value.name = name || ''
  initialProjectData.value.description = description || ''
}

const restoreProjectdata = () => {
  projectData.value.name = initialProjectData.value.name
  projectData.value.description = initialProjectData.value.description
}

const updateProjectData = async () => {
  try {
    const payload = {
      name: projectData.value.name,
      description: projectData.value.description,
    }

    await projectStore.updateProject(payload)

    layoutStore.showToast({
      message: t('settings.columns.columnsUpdateSuccess'),
      type: 'success',
    })

    await projectStore.getItem()
    setProjectDataEntryValues()
  } catch (e) {
    console.error(e)

    layoutStore.showToast({
      message: t('settings.columns.columnsUpdateError'),
      type: 'error',
    })
  }
}
</script>

<template>
  <Form v-slot="{ errors }">
    <form @submit.prevent="updateProjectData">
      <SettingsSectionTemplate>
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
          <div class="content pt-4 pb-3 px-5 flex gap-5">
            <div class="flex flex-column" style="min-width: 265px">
              <span class="field-label">{{
                $t('settings.projectData.name')
              }}</span>
              <BaseInput
                v-model="projectData.name"
                :label="$t('tasks.name')"
                :placeholder="$t('settings.projectData.enterProjectName')"
                :floatLabel="false"
                :disabled="!isAdmin"
                medium
                disableOutline
                :rules="[(value:string) => rules.required(value, $t('settings.projectData.name')), (value:string) => rules.maxLength(value,20,$t('settings.projectData.name'))]"
              />
            </div>
            <div class="flex flex-column w-full ml-2">
              <span class="field-label">{{
                $t('settings.projectData.description')
              }}</span>
              <BaseInput
                v-model="projectData.description"
                :label="$t('settings.projectData.description')"
                :placeholder="$t('settings.projectData.enterProjectDescription')"
                :floatLabel="false"
                :disabled="!isAdmin"
                medium
                disableOutline
                :rules="[(value:string) => rules.required(value,$t('settings.projectData.description')), (value:string) => rules.maxLength(value,100,$t('settings.projectData.description'))]"
              />
            </div>
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

.content {
  background-color: #2c2c38;
}
</style>

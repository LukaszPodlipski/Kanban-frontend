<script setup lang="ts">
import ProjectColumnsTableInput from '@/components/dashboard/project/settings/inputs/ProjectColumnsTableInput.vue'
import ProjectDataInput from '@/components/dashboard/project/settings/inputs/ProjectDataInput.vue'
import DialogTemplate from '@/components/layout/dialog/DialogTemplate.vue'
import { useProjectStore } from '@/stores/project'
import { iColumn, Column as ProjectColumn } from '@/types/columnTypes'
import { iMemberItem } from '@/types/userTypes'
import { randomPastelColor } from '@/utils/functions'
import TabPanel from 'primevue/tabpanel'
import TabView from 'primevue/tabview'
import { useForm } from 'vee-validate'
import { computed, reactive, Ref, ref, watch } from 'vue'

import MemberInvitationPartial from './partials/MemberInvitationPartial.vue'
import { useLayoutStore } from '@/stores/layout'

const projectStore = useProjectStore()
const layoutStore = useLayoutStore()
const activeTabIndex: Ref<number> = ref(0)

const { errors: projectDataErrors, resetField } = useForm()

const loading = computed(() => {
  return projectStore.loading
})

const isColumnsSectionValid = computed(() => {
  return (
    Object.values(aggregatedErrors.value).filter((value) => value !== undefined)
      .length === 0
  )
})

const isProjectDataSectionValid = computed(() => {
  return Object.keys(projectDataErrors.value).length === 0 && project.name
})

const formIsValid = computed(() => {
  return isColumnsSectionValid.value && isProjectDataSectionValid.value
})

interface iProject {
  name: string
  description: string
  prefix: string
  columns: iColumn[]
  members: iMemberItem[]
}

const project: iProject = reactive({
  name: '',
  description: '',
  prefix: '',
  columns: [],
  members: [],
})

watch(
  () => project.name,
  () => {
    if (project.name.length > 2) {
      project.prefix = project.name.substring(0, 3).toUpperCase()
      resetField('prefixField')
    }
    if (project.name.length === 0) {
      project.prefix = ''
      resetField('prefixField')
    }
  },
)
const addNewColumn = () => {
  const newColumn = new ProjectColumn({
    id: null,
    color: randomPastelColor(),
    order: project.columns.length + 1,
    name: '',
    type: null,
    description: '',
  })

  project.columns.push(newColumn)
}

const aggregatedErrors: Ref<Record<string, string | undefined>> = ref({})

const submitProject = async () => {
  if (formIsValid.value) {
    try {
      const params = {
        ...project,
        members: project.members.map((member) => ({
          id: member.id,
          role: member.role,
        })),
      }
      await projectStore.createProject(params)
      layoutStore.closeDialog()
    } catch (err) {
      console.log(err)
    }
  }
}
</script>

<template>
  <form @submit.prevent="" class="flex flex-column">
    <DialogTemplate :loading="loading" denseActions>
      <template #content>
        <TabView v-model:activeIndex="activeTabIndex">
          <TabPanel header="Dane projektu">
            <div class="px-4 pt-4">
              <ProjectDataInput
                v-model:name="project.name"
                v-model:description="project.description"
                v-model:prefix="project.prefix"
              />
            </div>
          </TabPanel>
          <TabPanel header="Kolumny">
            <div class="columns-table-wrapper mb-4">
              <ProjectColumnsTableInput
                v-model:columns="project.columns"
                v-model:aggregated-errors="aggregatedErrors"
              />
            </div>
          </TabPanel>
          <TabPanel header="Zaproś członków">
            <div class="pb-4">
              <MemberInvitationPartial v-model:members="project.members" />
            </div>
          </TabPanel>
        </TabView>
      </template>
      <template #toolsButtons>
        <BaseButton
          v-if="activeTabIndex === 1"
          outlined
          :label="$t('settings.columns.addNewColumn')"
          icon="plus"
          :disabled="loading"
          @click="addNewColumn"
        />
      </template>
      <template #actions>
        <BaseButton
          type="submit"
          :label="$t('project.createProject')"
          icon="check"
          :disabled="!formIsValid || loading"
          @click="submitProject"
        />
      </template>
    </DialogTemplate>
  </form>
</template>

<style scoped lang="scss">
.columns-table-wrapper {
  border-radius: 4px;
  max-height: calc(100vh - 400px);
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 4px;
    height: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: $grayscale-darken1;
  }

  &::-webkit-scrollbar-track {
    background: $grayscale-darken5;
  }
}
:deep(.p-tabview .p-tabview-panels) {
  padding: 0 !important;
}
</style>

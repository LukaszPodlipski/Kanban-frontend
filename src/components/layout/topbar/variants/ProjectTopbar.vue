<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useProjectStore } from '@/stores/project'
import { useLayoutStore } from '@/stores/layout'
import { useTasksStore } from '@/stores/tasks'

import ProjectMembers from '../fragments/ProjectMembers.vue'
import TopbarTemplate from '../fragments/TopbarTemplate.vue'

import SettingsIcon from '@/components/icons/SettingsIcon.vue'
import BacklogIcon from '@/components/icons/BacklogIcon.vue'

import debounce from 'lodash.debounce'

const projectStore = useProjectStore()
const layoutStore = useLayoutStore()
const tasksStore = useTasksStore()

const filters = ref({
  query: '',
  assigneeIds: [] as number[],
})

watch(
  filters,
  debounce(async (value) => {
    await tasksStore.getItems(value)
  }, 300),
  { deep: true },
)

const openDialog = () => {
  layoutStore.openDialog({
    title: 'Add New Task',
    component: 'AddNewTaskDialog',
  })
}

const router = useRouter()

const navigateToSettings = () => {
  router.push({
    name: 'ProjectSettings',
    params: {
      id: projectStore.project?.id,
    },
  })
}

const navigateToBacklog = () => {
  router.push({
    name: 'ProjectBacklog',
    params: {
      id: projectStore.project?.id,
    },
  })
}
</script>

<template>
  <TopbarTemplate :loading="projectStore.loading">
    <template v-slot:title>
      <span>{{ projectStore.project?.name }}</span>
    </template>
    <template v-slot:left>
      <ProjectMembers v-model:model-value="filters.assigneeIds" class="ml-4" />
    </template>
    <template v-slot:right>
      <BaseSearch
        v-model="filters.query"
        label="Search"
        :disabled="projectStore.loading"
        :loading="tasksStore.loading"
        class="mr-4"
      />
      <BaseButton
        label="Add New Task"
        icon="plus"
        :disabled="tasksStore.loading"
        @click="openDialog"
        class="mr-4"
      />
      <BacklogIcon
        class="cursor-pointer mr-4"
        :size="24"
        color="#6560ba"
        @click="navigateToBacklog"
      />
      <SettingsIcon
        class="cursor-pointer"
        :size="28"
        color="#6560ba"
        @click="navigateToSettings"
      />
    </template>
  </TopbarTemplate>
</template>

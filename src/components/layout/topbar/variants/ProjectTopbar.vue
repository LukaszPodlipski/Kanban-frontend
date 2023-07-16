<script setup lang="ts">
import { ref, watch } from 'vue'
import { useProjectStore } from '@/stores/project'
import { useLayoutStore } from '@/stores/layout'
import { useTasksStore } from '@/stores/tasks'
import ProjectMembers from '../fragments/ProjectMembers.vue'
import TopbarTemplate from '../fragments/TopbarTemplate.vue'
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
      <i class="pi pi-cog" :style="{ color: '#6560ba', fontSize: '24px' }"></i>
    </template>
  </TopbarTemplate>
</template>

import { defineStore } from 'pinia'
import { computed, ref, Ref, ComputedRef } from 'vue'

import { iProjectData, iColumn } from '@/types/projectTypes'
import { iTask } from '@/types/taskTypes'

import projectsApi from '@/api/v1/projectApi'

import { falseLoadingState } from '@/utils/functions'

import stores from '@/stores'

export const useProjectStore = defineStore('project', () => {
  const loading: Ref<boolean> = ref(false) // loading state of global project operations

  const columnsStore = stores.useColumnsStore()
  const tasksStore = stores.useTasksStore()
  const membersStore = stores.useMembersStore()

  const selectedProjectId: Ref<number | null> = ref(null)

  // we separate project data into 3 different variables to make it easier to work with
  const projectData: Ref<iProjectData | null> = ref(null)
  const columns: ComputedRef<iColumn[]> = computed(() => columnsStore.items)
  const tasks: ComputedRef<iTask[]> = computed(() => tasksStore.items)

  // project is a computed property that returns the project data in format which works with vue-draggable
  const project = computed(() => {
    if (Object.keys(project)) {
      return {
        ...projectData.value,
        columns: columns.value
          .map((column) => {
            return {
              ...column,
              tasks: tasks.value
                .filter((task) => task.projectColumnId === column.id)
                .sort((a, b) => a.order - b.order),
            }
          })
          .sort((a, b) => a.order - b.order),
      }
    } else return null
  })

  const getItem = async (id: number) => {
    loading.value = await true
    try {
      const response = await projectsApi.getSingleProject(id)
      projectData.value = response
    } catch (error) {
      selectedProjectId.value = null
      throw error
    } finally {
      loading.value = await falseLoadingState()
    }
  }

  const getCompleteProject = async (id: number) => {
    selectedProjectId.value = id
    try {
      await Promise.all([
        getItem(id),
        columnsStore.getItems(id),
        tasksStore.getItems(id),
        membersStore.getItems(id),
      ])
    } catch (error) {
      selectedProjectId.value = null
      throw error
    }
  }

  const clearSelectedProject = () => {
    selectedProjectId.value = null
    projectData.value = null
  }

  return {
    clearSelectedProject,
    loading,
    project,
    selectedProjectId,
    getItem,
    getCompleteProject,
  }
})

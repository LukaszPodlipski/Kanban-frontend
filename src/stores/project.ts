import projectsApi from '@/api/v1/projectApi'
import { useColumnsStore } from '@/stores/columns'
import { useMembersStore } from '@/stores/members'
import { useTasksStore } from '@/stores/tasks'
import { iColumn } from '@/types/columnTypes'
import { iSimplifiedProject } from '@/types/projectTypes'
import { iSimplifiedTask } from '@/types/taskTypes'
import { falseLoadingState } from '@/utils/functions'
import { defineStore } from 'pinia'
import { computed, ComputedRef, ref, Ref } from 'vue'
import { useRoute } from 'vue-router'

export const useProjectStore = defineStore('project', () => {
  const loading: Ref<boolean> = ref(false) // loading state of global project operations

  const columnsStore = useColumnsStore()
  const tasksStore = useTasksStore()
  const membersStore = useMembersStore()

  const route = useRoute()

  const id = computed(() => Number(route.params.id))

  const selectedProjectId: Ref<number | null> = ref(id || null)

  // we separate project data into 3 different variables to make it easier to work with
  const projectData: Ref<iSimplifiedProject | null> = ref(null)
  const columns: ComputedRef<iColumn[]> = computed(() => columnsStore.items)
  const tasks: ComputedRef<iSimplifiedTask[]> = computed(() => tasksStore.items)

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

  const getItem = async () => {
    loading.value = await true
    try {
      const response = await projectsApi.getSingleProject(
        selectedProjectId.value as number,
      )
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
        getItem(),
        columnsStore.getItems(),
        tasksStore.getItems(),
        membersStore.getItems(),
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

  const updateProject = async (payload: Partial<iSimplifiedProject>) => {
    loading.value = true
    try {
      await projectsApi.updateProject(
        selectedProjectId.value as number,
        payload,
      )
    } catch (error) {
      throw error
    } finally {
      loading.value = await falseLoadingState()
    }
  }

  const WSUpdatedProjectHandler = (data: any) => {
    const { name, description } = data
    if (name) projectData.value!.name = name
    if (description) projectData.value!.description = description
  }

  const createProject = async (payload: any) => {
    loading.value = true
    try {
      await projectsApi.createProject(payload)
    } catch (error) {
      throw error
    } finally {
      loading.value = await falseLoadingState()
    }
  }

  return {
    clearSelectedProject,
    loading,
    project,
    projectData,
    updateProject,
    selectedProjectId,
    getItem,
    getCompleteProject,
    WSUpdatedProjectHandler,
    createProject,
  }
})

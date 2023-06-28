import { defineStore } from 'pinia'
import { computed, ref, Ref } from 'vue'

import { iProjectData, iColumn } from '@/types/singleProjectTypes'
import { ISimplifiedUser } from '@/types/userTypes'
import { iTask } from '@/types/taskTypes'

import projectsApi from '@/api/v1/projectsApi'
import tasksApi from '@/api/v1/tasksApi'

import { falseLoadingState } from '@/utils/functions'

export const useSingleProjectStore = defineStore('singleProject', () => {
  const loading: Ref<boolean> = ref(false) // loading state of global project operations
  const loadingUpdate: Ref<boolean> = ref(false) // loading state of updating project data

  const selectedProjectId: Ref<number | null> = ref(null)

  // we separate project data into 3 different variables to make it easier to work with
  const projectData: Ref<iProjectData | null> = ref(null)
  const columns: Ref<iColumn[]> = ref([])
  const tasks: Ref<iTask[]> = ref([])
  const members: Ref<ISimplifiedUser[]> = ref([])

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

  const setSelectedProject = async (id: number) => {
    loading.value = true
    selectedProjectId.value = id

    try {
      const response = await projectsApi.getSingleProject(id)

      const {
        columns: projectColumns,
        tasks: projectTasks,
        members: projectMembers,
        ...project
      } = response

      members.value = projectMembers || []
      projectData.value = project
      columns.value = projectColumns
      tasks.value = projectTasks
    } catch (error) {
      throw error
    } finally {
      loading.value = await falseLoadingState()
    }
  }

  const clearSelectedProject = () => {
    selectedProjectId.value = null
    projectData.value = null
  }

  const moveTask = async (payload: any) => {
    loadingUpdate.value = true
    try {
      const index = tasks.value.findIndex((task) => task.id === payload.taskId)
      tasks.value[index] = { ...tasks.value[index], updating: true }
      tasksApi.moveTask(payload)
    } catch (error) {
      throw error
    } finally {
      loadingUpdate.value = await falseLoadingState(100)
    }
  }

  const updateTask = (data: iTask) => {
    const updatedIndex = tasks.value.findIndex((task) => task.id === data.id)
    tasks.value[updatedIndex] = data
  }

  const createTask = (data: unknown) => {
    console.log('createTask', data)
  }

  const deleteTask = (data: unknown) => {
    console.log('deleteTask', data)
  }

  const updateColumn = (data: unknown) => {
    console.log('updateColumn', data)
  }

  const createColumn = (data: unknown) => {
    console.log('createColumn', data)
  }

  const deleteColumn = (data: unknown) => {
    console.log('deleteColumn', data)
  }

  const updateProjectData = (data: unknown) => {
    console.log('updateProjectData', data)
  }

  return {
    clearSelectedProject,
    loading,
    loadingUpdate,
    tasks,
    project,
    members,
    selectedProjectId,
    setSelectedProject,
    moveTask,
    updateTask,
    createTask,
    deleteTask,
    updateColumn,
    deleteColumn,
    createColumn,

    updateProjectData,
  }
})

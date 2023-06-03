import { defineStore } from 'pinia'
import { ref } from 'vue'

import { singleProject } from '@/models/singleProjectModels'

const mockedSelectedProject = async (id: number): Promise<singleProject> => {
  return new Promise((resolve, _) => {
    return setTimeout(() => {
      resolve({
        id,
        name: `Project ${id} with long name`,
        description: `Description for project ${id}`,
        columns: [
          {
            id: 1,
            name: 'Column 1',
            description: 'Description for column 1',
            color: '#836FF2',
            tasks: [
              {
                id: 1,
                name: 'Building UI for onboarding flow',
                description: 'Description for task 1',
              },
              {
                id: 2,
                name: 'Building UI for onboarding flow',
                description: 'Description for task 2',
              },
              {
                id: 3,
                name: 'Building UI for onboarding flow',
                description: 'Description for task 3',
              },
            ],
          },
          {
            id: 2,
            name: 'Column 2',
            description: 'Description for column 2',
            color: '#4EC4DF',
            tasks: [
              {
                id: 4,
                name: 'Task 4',
                description: 'Description for task 4',
              },
              {
                id: 5,
                name: 'Task 5',
                description: 'Description for task 5',
              },
              {
                id: 6,
                name: 'Task 6',
                description: 'Description for task 6',
              },
            ],
          },
          {
            id: 3,
            name: 'Column 3',
            description: 'Description for column 3',
            color: '#4EC4DF',
            tasks: [
              {
                id: 4,
                name: 'Task 4',
                description: 'Description for task 7',
              },
              {
                id: 5,
                name: 'Task 5',
                description: 'Description for task 8',
              },
              {
                id: 6,
                name: 'Task 6',
                description: 'Description for task 9',
              },
            ],
          },
          {
            id: 4,
            name: 'Column 4',
            description: 'Description for column 4',
            color: '#4EC4DF',
            tasks: [
              {
                id: 4,
                name: 'Task 4',
                description: 'Description for task 10',
              },
              {
                id: 5,
                name: 'Task 5',
                description: 'Description for task 11',
              },
              {
                id: 6,
                name: 'Task 6',
                description: 'Description for task 12',
              },
            ],
          },
        ],
      })
    }, 1000)
  })
}

export const useSingleProjectStore = defineStore('singleProject', () => {
  const selectedProjectId = ref<number | null>(null)
  const project = ref<singleProject | null>(null)
  const loading = ref(false)

  const setSelectedProject = async (id: number) => {
    loading.value = true
    selectedProjectId.value = id
    try {
      project.value = await mockedSelectedProject(id)
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateProject = (updatedProject: any) => {
    project.value = updatedProject
  }

  const clearSelectedProject = () => {
    selectedProjectId.value = null
    project.value = null
  }

  return {
    clearSelectedProject,
    loading,
    project,
    selectedProjectId,
    setSelectedProject,
    updateProject,
  }
})

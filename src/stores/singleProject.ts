import { defineStore } from 'pinia'
import { ref } from 'vue'

const mockedSelectedProject = async (id: number) => {
  return new Promise((resolve, _) => {
    return setTimeout(() => {
      resolve({
        id,
        name: `Project ${id}`,
        description: `Description for project ${id}`,
        columns: [
          {
            id: 1,
            name: 'Column 1',
            description: 'Description for column 1',
            tasks: [
              {
                id: 1,
                name: 'Task 1',
                description: 'Description for task 1',
              },
              {
                id: 2,
                name: 'Task 2',
                description: 'Description for task 2',
              },
              {
                id: 3,
                name: 'Task 3',
                description: 'Description for task 3',
              },
            ],
          },
          {
            id: 2,
            name: 'Column 2',
            description: 'Description for column 2',
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
        ],
      })
    }, 1000)
  })
}

export const useSingleProjectStore = defineStore('singleProject', () => {
  const selectedProjectId = ref<any>(null)
  const project = ref<any>()
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
  }
})

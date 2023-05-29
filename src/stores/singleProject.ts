import { defineStore } from 'pinia'
import { ref } from 'vue'

const mockedSelectedProject = async (id: number) => {
  return new Promise((resolve, _) => {
    return setTimeout(() => {
      resolve({
        id,
        name: `Project ${id}`,
        description: `Description for project ${id}`,
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

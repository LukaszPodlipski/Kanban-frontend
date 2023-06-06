import { defineStore } from 'pinia'
import { ref } from 'vue'

import { iSingleProject } from '@/models/singleProjectTypes'

import { getSingleProject } from '@/api/v1/projectsApi'

import { falseLoadingState } from '@/utils/functions'

export const useSingleProjectStore = defineStore('singleProject', () => {
  const selectedProjectId = ref<number | null>(null)
  const project = ref<iSingleProject | null>(null)
  const loading = ref(false)
  const loadingUpdate = ref(false)

  const setSelectedProject = async (id: number) => {
    loading.value = true
    selectedProjectId.value = id
    try {
      project.value = await getSingleProject(id.toString())
    } catch (error) {
      throw error
    } finally {
      loading.value = await falseLoadingState()
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
    loadingUpdate,
    project,
    selectedProjectId,
    setSelectedProject,
    updateProject,
  }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'

import { iProjectsMenuList } from '@/types/projectsListTypes'
import projectsApi from '@/api/v1/projectsApi'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<iProjectsMenuList>([])

  const addProject = (project: any) => {
    projects.value.push(project)
  }

  const getProjects = async () => {
    try {
      const response = await projectsApi.getProjectsList()
      projects.value = response
    } catch (error) {
      throw error
    }
  }

  return { projects, getProjects, addProject }
})

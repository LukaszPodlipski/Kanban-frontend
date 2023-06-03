import { defineStore } from 'pinia'
import { ref } from 'vue'

import { ProjectsMenuList } from '@/models/projectsListModels'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<ProjectsMenuList>([
    { name: 'Project 1 with long name', id: 1 },
    { name: 'Project 2', id: 2 },
    { name: 'Project 3', id: 3 },
    { name: 'Project 4', id: 4 },
    { name: 'Project 5', id: 5 },
    { name: 'Project 6', id: 6 },
    { name: 'Project 7', id: 7 },
    { name: 'Project 8', id: 8 },
    { name: 'Project 9', id: 9 },
    { name: 'Project 10', id: 10 },
  ])

  const addProject = (project: any) => {
    projects.value.push(project)
  }

  return { projects, addProject }
})

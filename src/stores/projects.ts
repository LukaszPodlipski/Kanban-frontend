import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<any[]>([
    { name: 'Project 1', id: 1 },
    { name: 'Project 2', id: 2 },
    { name: 'Project 3', id: 3 },
  ])

  const addProject = (project: any) => {
    projects.value.push(project)
  }

  return { projects, addProject }
})

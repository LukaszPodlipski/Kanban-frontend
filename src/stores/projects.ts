import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<any[]>([])

  const addProject = (project: any) => {
    projects.value.push(project)
  }


  return { projects, addProject  }
})
import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '../router'

export const useSingleProjectStore = defineStore('singleProject', () => {
  const project = ref<any>()

  const selectProject = (selectProject: any) => {
    project.value = selectProject
    router.push({ name: 'SingleProject', params: { id: selectProject.id } })
  }

  return { project, selectProject }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLayoutStore = defineStore('layout', () => {
  const sideBarOpened = ref<boolean>(true)

  const changeSideBarStatus = () => {
    sideBarOpened.value = !sideBarOpened.value
  }

  return { sideBarOpened, changeSideBarStatus }
})

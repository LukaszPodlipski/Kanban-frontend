import { defineStore } from 'pinia'
import { ref, Ref } from 'vue'

interface Dialog {
  title?: string
  isActive: boolean
  item?: any
  component?: string
}

export const useLayoutStore = defineStore('layout', () => {
  const sideBarOpened: Ref<boolean> = ref(true)
  const dialog: Ref<Dialog> = ref({isActive: false} as Dialog)

  const openDialog = ({ title, item, component }: { title: string, item: any, component: string })  => {
    dialog.value = {
      title,
      item,
      component,
      isActive: true,
    }
  }

  const closeDialog = () => {
    dialog.value = {
      isActive: false,
    }
  }

  const changeSideBarStatus = () => {
    sideBarOpened.value = !sideBarOpened.value
  }

  return { sideBarOpened, changeSideBarStatus, openDialog, closeDialog, dialog }
})

import { defineStore } from 'pinia'
import { ref, Ref } from 'vue'
import { useToast } from 'primevue/usetoast'

interface Dialog {
  title?: string
  isActive: boolean
  item?: any
  component?: string
}

export const useLayoutStore = defineStore('layout', () => {
  const sideBarOpened: Ref<boolean> = ref(true)
  const dialog: Ref<Dialog> = ref({ isActive: false } as Dialog)
  const toast = useToast()

  const openDialog = ({
    title,
    item,
    component,
  }: {
    title: string
    item: any
    component: string
  }) => {
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

  const showToast = ({
    type,
    message,
    life,
  }: {
    type: string
    message: string
    life: number
  }) => {
    const calculatedLife =
      message.length * 65 >= 3000 ? message.length * 45 : 3000

    toast.add({
      severity: type || 'success',
      summary: message || '',
      life: calculatedLife,
    })
  }

  return {
    sideBarOpened,
    changeSideBarStatus,
    openDialog,
    closeDialog,
    dialog,
    showToast,
  }
})

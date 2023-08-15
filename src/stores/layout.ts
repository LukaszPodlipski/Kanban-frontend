import { defineStore } from 'pinia'
import { ref, Ref } from 'vue'
import { useToast } from 'primevue/usetoast'

interface Dialog {
  title?: string
  isActive: boolean
  item?: any
  component?: string
  hideHeader?: boolean
  size?: string
}

export const useLayoutStore = defineStore('layout', () => {
  const sideBarOpened: Ref<boolean> = ref(true)
  const dialog: Ref<Dialog> = ref({ isActive: false } as Dialog)
  const toast = useToast()

  const openDialog = async ({
    title,
    item,
    component,
    hideHeader,
    size,
  }: Omit<Dialog, 'isActive'>) => {
    dialog.value = {
      title,
      item,
      component,
      isActive: true,
      hideHeader: hideHeader || false,
      size: size || '',
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

  const setLayoutDefaultState = () => {
    sideBarOpened.value = true
    dialog.value = {
      isActive: false,
    }
  }

  const showToast = ({
    type,
    message,
  }: {
    type?: 'success' | 'info' | 'warn' | 'error'
    message: string
    life?: number
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
    setLayoutDefaultState
  }
})

import { defineStore } from 'pinia'
import { useToast } from 'primevue/usetoast'
import { ref, Ref } from 'vue'

interface Dialog {
  title?: string
  isActive: boolean
  item?: any
  component?: string
  hideHeader?: boolean
  size?: string
}

type SidebarSizeType = 'large' | 'small' | 'hidden'

const sideBarSizeChange: Record<SidebarSizeType, SidebarSizeType> = {
  large: 'small',
  small: 'hidden',
  hidden: 'large',
}

export const useLayoutStore = defineStore('layout', () => {
  const sidebarSize: Ref<SidebarSizeType> = ref("large")
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
    sidebarSize.value = sideBarSizeChange[sidebarSize.value]
  }

  const setLayoutDefaultState = () => {
    sidebarSize.value = 'large'
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
    sidebarSize,
    changeSideBarStatus,
    openDialog,
    closeDialog,
    dialog,
    showToast,
    setLayoutDefaultState,
  }
})

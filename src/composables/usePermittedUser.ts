import { useProjectStore } from '@/stores/project'
import { computed } from 'vue'

export default function usePermittedUser() {
  const projectStore = useProjectStore()

  const userRole = computed(() => {
    return projectStore.project?.role as string
  })

  const isOwner = computed(() => {
    return userRole.value === 'Owner'
  })

  const isMainteiner = computed(() => {
    return userRole.value === 'Maintainer'
  })

  const isAdmin = computed(() => {
    return isOwner.value || isMainteiner.value
  })

  const isEditor = computed(() => {
    return isAdmin || userRole.value === 'Editor'
  })

  const isViewer = computed(() => {
    return userRole.value === 'Viewer'
  })

  const checkIsEditor = (role: string) => {
    if(!role) return false
    return  ['Owner', 'Maintainer', 'Editor'].includes(role)
  }

  return { userRole, isEditor, isOwner, isMainteiner, isViewer, isAdmin, checkIsEditor }
}

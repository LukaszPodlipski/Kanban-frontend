import { Ref, ref, watch } from 'vue'
import debounce from 'lodash.debounce'
import { useRouter } from 'vue-router'

import { useTasksStore } from '@/stores/tasks'
import { useProjectStore } from '@/stores/project'
import { useLayoutStore } from '@/stores/layout'

export default function useProjectTopbarUtilities() {
  const tasksStore = useTasksStore()

  const filters: Ref<{ query: string; assigneeIds: number[] }> = ref({
    query: '',
    assigneeIds: [] as number[],
  })

  watch(
    filters,
    debounce(async (value) => {
      await tasksStore.getItems(value)
    }, 300),
    { deep: true },
  )

  const router = useRouter()
  const projectStore = useProjectStore()
  const layoutStore = useLayoutStore()

  const navigateToSettings = () => {
    router.push({
      name: 'ProjectSettings',
      params: {
        id: projectStore.project?.id,
      },
    })
  }

  const navigateToProject = () => {
    router.push({
      name: 'Project',
      params: {
        id: projectStore.project?.id,
      },
    })
  }

  const navigateToBacklog = () => {
    router.push({
      name: 'ProjectBacklog',
      params: {
        id: projectStore.project?.id,
      },
    })
  }

  const openNewTaskDialog = () => {
    layoutStore.openDialog({
      title: 'Add New Task',
      component: 'AddNewTaskDialog',
    })
  }

  return { filters, navigateToSettings, navigateToProject, navigateToBacklog, openNewTaskDialog }
}

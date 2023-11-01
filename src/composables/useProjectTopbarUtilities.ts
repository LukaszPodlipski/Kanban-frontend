import { useLayoutStore } from '@/stores/layout'
import { useProjectStore } from '@/stores/project'
import { useTasksStore } from '@/stores/tasks'
import debounce from 'lodash.debounce'
import { Ref, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

export default function useProjectTopbarUtilities() {
  const { t } = useI18n()
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

  const navigateToBoard = () => {
    router.push({
      name: 'Board',
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
      title: t('project.addNewTask'),
      component: 'AddNewTaskDialog',
    })
  }

  return {
    filters,
    navigateToSettings,
    navigateToBoard,
    navigateToBacklog,
    openNewTaskDialog,
  }
}

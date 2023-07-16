import { computed, ref, Ref } from 'vue'
import api from '@/api/v1/indexApi'
import { falseLoadingState } from '@/utils/functions'
import { useProjectStore } from '@/stores/project'

interface Item {
  id: number
}

export const storeContructor = <T extends Item>(endpoint: string) => {
  const items: Ref<T[]> = ref([])
  const item: Ref<T[] | null> = ref(null)
  const loading: Ref<boolean> = ref(false)

  const projectStore = useProjectStore()
  const selectedProjectId = computed<number | null>(
    () => projectStore.selectedProjectId || null,
  )

  const getItems = async (filters: any | undefined = {}) => {
    try {
      loading.value = true
      const response = await api.getItems(endpoint, {
        id: selectedProjectId.value,
        filters,
      })
      items.value = response
    } catch (error) {
      throw error
    } finally {
      loading.value = await falseLoadingState()
    }
  }

  const getItem = async () => {
    try {
      loading.value = true
      const response = await api.getItem(
        endpoint,
        selectedProjectId.value as number,
      )
      item.value = response
    } catch (error) {
      throw error
    } finally {
      loading.value = await falseLoadingState()
    }
  }

  const createItem = async (params: any) => {
    try {
      loading.value = true
      if (selectedProjectId.value)
        await api.createItem(endpoint, params, selectedProjectId.value)
    } catch (error) {
      throw error
    } finally {
      loading.value = await falseLoadingState()
    }
  }

  const updateItem = async (id: number, params: any) => {
    try {
      const index = items.value.findIndex((item) => item.id === id)
      items.value[index] = { ...items.value[index], updating: true }
      await api.updateItem(endpoint, id, params)
    } catch (error) {
      throw error
    } finally {
      loading.value = await falseLoadingState()
    }
  }

  const WSCreatedItemsHandler = (item: any) => {
    items.value.push(item)
  }

  const WSUpdatedItemHandler = (item: any) => {
    item.value = item
  }

  const WSUpdatedItemsHandler = (item: any) => {
    const index = items.value.findIndex((i) => i.id === item.id)
    items.value[index] = item
  }

  const WSDeletedItemsHandler = (item: any) => {
    const index = items.value.findIndex((i) => i.id === item.id)
    items.value.splice(index, 1)
  }

  const updateItemWithSpecificAction = async (
    id: number,
    action: string,
    params: any,
  ) => {
    try {
      loading.value = true
      const index = items.value.findIndex((item) => item.id === id)
      items.value[index] = { ...items.value[index], updating: true }
      await api.updateItemWithSpecificAction(endpoint, id, action, params)
    } catch (error) {
      throw error
    } finally {
      loading.value = await falseLoadingState(100)
    }
  }

  const deleteItem = async (id: number) => {
    try {
      loading.value = true
      await api.deleteItem(endpoint, id)
    } catch (error) {
      throw error
    } finally {
      loading.value = await falseLoadingState()
    }
  }

  return {
    loading,
    items,
    item,
    getItems,
    getItem,
    createItem,
    updateItem,
    updateItemWithSpecificAction,
    deleteItem,
    WSCreatedItemsHandler,
    WSUpdatedItemHandler,
    WSUpdatedItemsHandler,
    WSDeletedItemsHandler,
  }
}

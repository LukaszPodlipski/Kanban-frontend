import { computed, ref } from 'vue'
import api from '@/api/v1/indexApi'
import { falseLoadingState } from '@/utils/functions'
import stores from '@/stores/index'

interface Item {
  id: number
}

export const storeContructor = <T extends Item>(endpoint: string) => {
  const items = ref<T[]>([])
  const item = ref<T | null>(null)
  const loading = ref(false)

  const projectStore = stores.useProjectStore()
  const selectedProjectId = computed<number>(() => projectStore.project.id)

  const getItems = async (id: number | null = null) => {
    try {
      loading.value = true
      const response = await api.getItems(endpoint, { id })
      items.value = response
    } catch (error) {
      throw error
    } finally {
      loading.value = await falseLoadingState()
    }
  }

  const getItem = async (id: number) => {
    try {
      loading.value = true
      const response = await api.getItem(endpoint, id)
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

  const WSDeletedItemsHandler = (id: number) => {
    const index = items.value.findIndex((i) => i.id === id)
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

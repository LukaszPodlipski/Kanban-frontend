import api from '@/api/v1/indexApi'
import { useProjectStore } from '@/stores/project'
import { falseLoadingState } from '@/utils/functions'
import { computed, ref, Ref } from 'vue'

interface Item {
  id: number
}

export const storeContructor = <T extends Item, Y extends Item>(
  endpoint: string,
) => {
  const items = ref([]) as Ref<Y[]>
  const item = ref({} as T) as Ref<T>
  const loading = ref(false) as Ref<boolean>

  const projectStore = useProjectStore()
  const selectedProjectId = computed<number | null>(
    () => projectStore.selectedProjectId || null,
  )

  const getItems = async (filters: any | undefined = {}) => {
    try {
      loading.value = true
      const response = await api.getItems(endpoint, {
        projectId: selectedProjectId.value,
        filters,
      })
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
      const response = await api.getItem(endpoint, id, {
        projectId: selectedProjectId.value,
      })
      item.value = response as T
    } catch (error) {
      throw error
    } finally {
      loading.value = await falseLoadingState()
    }
  }

  const fetchItem = async (id: number) => {
    try {
      loading.value = true
      const response = await api.getItem(endpoint, id, {
        projectId: selectedProjectId.value,
      })
      return response as T
    } catch (error) {
      throw error
    } finally {
      loading.value = await falseLoadingState()
    }
  }

  const createItem = async (params: any) => {
    try {
      loading.value = true
      await api.createItem(endpoint, {
        projectId: selectedProjectId.value,
        ...params,
      })
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
      await api.updateItem(endpoint, id, {
        projectId: selectedProjectId.value,
        ...params,
      })
    } catch (error) {
      throw error
    } finally {
      loading.value = await falseLoadingState()
    }
  }

  const updateItems = async (payload: any) => {
    try {
      loading.value = true
      await api.updateItems(endpoint, {
        projectId: selectedProjectId.value,
        [endpoint]: payload,
      })
    } catch (error) {
      throw error
    } finally {
      loading.value = await falseLoadingState()
    }
  }

  const WSCreatedItemsHandler = (createdItem: Y) => {
    items.value.push(createdItem as Y)
  }

  const WSUpdatedItemHandler = (updatedItem: T) => {
    item.value = updatedItem
  }

  const WSUpdatedItemsHandler = (updatedItem: Y) => {
    const index = items.value.findIndex((i) => i.id === updatedItem.id)
    items.value[index] = updatedItem as Y
  }

  const WSDeletedItemsHandler = (deletedItem: Y) => {
    const index = items.value.findIndex((i) => i.id === deletedItem.id)
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
      items.value[index] = { ...items.value[index], updating: true } as Y
      await api.updateItemWithSpecificAction(endpoint, id, action, params)
      items.value[index] = { ...items.value[index], updating: false } as Y
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
    fetchItem,
    createItem,
    updateItem,
    updateItems,
    updateItemWithSpecificAction,
    deleteItem,
    WSCreatedItemsHandler,
    WSUpdatedItemHandler,
    WSUpdatedItemsHandler,
    WSDeletedItemsHandler,
  }
}

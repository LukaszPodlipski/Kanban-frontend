import columnsApi from '@/api/v1/columnsApi'
import { iColumn } from '@/types/columnTypes'
import { defineStore } from 'pinia'

import { storeContructor } from './storeConstructor'

export const useColumnsStore = defineStore('columns', () => {
  const updateColumns = async (columns: iColumn[]) => {
    await columnsApi.updateColumns(columns)
  }

  return {
    updateColumns,
    ...storeContructor<iColumn, iColumn>('columns'),
  }
})

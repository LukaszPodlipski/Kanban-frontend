import { iColumn } from '@/types/columnTypes'
import { defineStore } from 'pinia'

import { storeContructor } from './storeConstructor'

export const useColumnsStore = defineStore('columns', () =>
  storeContructor<iColumn, iColumn>('columns'),
)

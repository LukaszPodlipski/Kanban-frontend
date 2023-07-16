import { defineStore } from 'pinia'
import { iColumn } from '@/types/projectTypes'
import { storeContructor } from './storeConstructor'

export const useColumnsStore = defineStore('columns', () =>
  storeContructor<iColumn>('columns'),
)

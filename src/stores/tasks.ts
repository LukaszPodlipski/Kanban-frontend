import { iSimplifiedTask, iTask } from '@/types/taskTypes'
import { defineStore } from 'pinia'

import { storeContructor } from './storeConstructor'

export const useTasksStore = defineStore('tasks', () =>
  storeContructor<iTask, iSimplifiedTask>('tasks'),
)

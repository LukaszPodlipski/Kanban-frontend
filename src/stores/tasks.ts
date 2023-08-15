import { defineStore } from 'pinia'
import { iTask, iSimplifiedTask } from '@/types/taskTypes'
import { storeContructor } from './storeConstructor'

export const useTasksStore = defineStore('tasks', () =>
  storeContructor<iTask, iSimplifiedTask>('tasks'),
)

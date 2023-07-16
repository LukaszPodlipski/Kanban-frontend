import { defineStore } from 'pinia'
import { iTask } from '@/types/taskTypes'
import { storeContructor } from './storeConstructor'

export const useTasksStore = defineStore('tasks', () =>
  storeContructor<iTask>('tasks'),
)

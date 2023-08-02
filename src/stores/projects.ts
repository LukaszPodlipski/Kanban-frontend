import { defineStore } from 'pinia'
import { iProjectSimplified } from '@/types/projectsListTypes'
import { storeContructor } from './storeConstructor'

export const useProjectsStore = defineStore('projects', () =>
  storeContructor<iProjectSimplified, iProjectSimplified>('projects'),
)

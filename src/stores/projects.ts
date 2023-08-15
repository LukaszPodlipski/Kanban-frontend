import { defineStore } from 'pinia'
import { iSimplifiedProject } from '@/types/projectTypes'
import { iListItem } from '@/types/baseTypes'
import { storeContructor } from './storeConstructor'

export const useProjectsStore = defineStore('projects', () =>
  storeContructor<iSimplifiedProject, iListItem>('projects'),
)

import { iListItem } from '@/types/baseTypes'
import { iSimplifiedProject } from '@/types/projectTypes'
import { defineStore } from 'pinia'

import { storeContructor } from './storeConstructor'

export const useProjectsStore = defineStore('projects', () =>
  storeContructor<iSimplifiedProject, iListItem>('projects'),
)

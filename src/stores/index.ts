import { storeContructor } from './base'
import { defineStore } from 'pinia'

import { useProjectStore } from './project'
import { useLayoutStore } from './layout'
import { useAuthStore } from './auth'
import { useWebsocketStore } from './websocket'

import { iProjectSimplified } from '@/types/projectsListTypes'
import { iColumn } from '@/types/projectTypes'
import { iTask } from '@/types/taskTypes'
import { ISimplifiedUser } from '@/types/userTypes'

const stores: any = {
  useAuthStore,
  useLayoutStore,
  useWebsocketStore,
  useProjectStore,
  useProjectsStore: defineStore('projects', () =>
    storeContructor<iProjectSimplified>('projects'),
  ),
  useTasksStore: defineStore('tasks', () => storeContructor<iTask>('tasks')),
  useColumnsStore: defineStore('columns', () =>
    storeContructor<iColumn>('columns'),
  ),
  useMembersStore: defineStore('members', () =>
    storeContructor<ISimplifiedUser>('members'),
  ),
}

export default stores

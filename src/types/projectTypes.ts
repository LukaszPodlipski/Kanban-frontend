import { iColumn } from './columnTypes'
import { iTask } from './taskTypes'
import { ISimplifiedUser } from './userTypes'

export interface iProject {
  id: number
  name: string
  description: string
  role: string
  prefix: string
  members: ISimplifiedUser[]
  columns: iColumn[]
  tasks: iTask[]
}

export type iSimplifiedProject = Pick<
  iProject,
  'id' | 'name' | 'description' | 'role' | 'prefix'
>

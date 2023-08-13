import { ISimplifiedUser } from './userTypes'

export interface iComment {
  id: number
  content: string
  taskId: number
  createdBy: ISimplifiedUser
  createdAt: string
}

export interface iTaskLog {
  id: number
  taskId: number
  content: string
  createdAt: string
  createdBy: ISimplifiedUser
}
export interface iTask {
  id: number
  name: string
  description: string
  order: number
  createdBy: ISimplifiedUser
  assignee: ISimplifiedUser
  projectColumnId: number
  identifier: string
  updating?: boolean
  relationMode: string | null
  relationId: number | null
  comments: iComment[]
  logs: iTaskLog[]
}

export interface iSimplifiedTask
  extends Pick<
    iTask,
    | 'id'
    | 'name'
    | 'identifier'
    | 'description'
    | 'assignee'
    | 'projectColumnId'
    | 'order'
  > {}

export interface iMoveTaskPayload {
  targetColumnId: number
  targetIndex: number
}

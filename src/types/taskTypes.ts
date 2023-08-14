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

export class Task implements iTask {
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

  constructor(data: iTask) {
    this.id = data.id
    this.name = data.name
    this.description = data.description
    this.order = data.order
    this.createdBy = data.createdBy
    this.assignee = {
      id: data.assignee?.id ?? null,
      fullName: data.assignee?.fullName ?? '',
      avatarUrl: data.assignee?.avatarUrl ?? '',
    }
    this.projectColumnId = data.projectColumnId
    this.identifier = data.identifier
    this.updating = data.updating
    this.relationMode = data.relationMode
    this.relationId = data.relationId
    this.comments = data.comments
    this.logs = data.logs
  }
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

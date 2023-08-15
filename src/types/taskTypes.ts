import { ISimplifiedUser } from './userTypes'

export interface iComment {
  id: number
  content: string
  taskId: number
  createdBy: ISimplifiedUser
  createdAt: string
  user: ISimplifiedUser
}

export interface iTaskLog {
  id: number
  taskId: number
  text: string
  createdAt: string
  user: ISimplifiedUser
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
  history: iTaskLog[]
  createdAt: string
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
  history: iTaskLog[]
  createdAt: string

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
    this.history = data.history
      ?.sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      })
      .map((log) => ({
        ...log,
        createdAt: new Date(log.createdAt).toLocaleString(),
      }))
    this.createdAt = new Date(data.createdAt).toLocaleString()
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

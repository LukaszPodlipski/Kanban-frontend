import { ISimplifiedUser } from './userTypes'
export interface iTask {
  id: number
  name: string
  description: string
  order: number
  createdBy: ISimplifiedUser
  assignee: ISimplifiedUser
  projectColumnId: number
  updating?: boolean
}

export interface iMoveTaskPayload {
  targetColumnId: number
  targetIndex: number
}
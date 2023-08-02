import { ISimplifiedUser } from './userTypes'
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

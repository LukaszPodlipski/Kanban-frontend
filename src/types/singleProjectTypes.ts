import { iTask } from './taskTypes'
import { ISimplifiedUser } from './userTypes'

export interface iColumn {
  id: number
  name: string
  description: string
  color: string
  order: number
}

export interface iProject {
  id: number
  name: string
  description: string
  isOwner: boolean
  members: ISimplifiedUser[]
  columns: iColumn[]
  tasks: iTask[]
}

export interface iProjectData {
  id: number
  name: string
  description: string
}

export interface iCompleteProject {
  id: number
  name: string
  isOwner: boolean
  members: ISimplifiedUser[]
  description: string
  columns: iColumn[]
}

export class CompleteProject implements iCompleteProject {
  id: number
  name: string
  isOwner: boolean
  members: ISimplifiedUser[]
  description: string
  columns: iColumn[]

  constructor(project: iProject) {
    this.id = project.id
    this.name = project.name
    this.isOwner = project.isOwner
    this.description = project.description
    this.members = project.members
    this.columns =
      project?.columns
        .map((column) => {
          return {
            ...column,
            tasks: project.tasks
              .filter((task) => task.projectColumnId === column.id)
              .sort((a, b) => a.order - b.order),
          }
        })
        .sort((a, b) => a.order - b.order) || []
  }
}

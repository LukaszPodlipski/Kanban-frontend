export interface iTask {
  id: number
  name: string
  description: string
}

export interface iColumn {
  id: number
  name: string
  description: string
  color: string
  tasks: iTask[]
}

export interface iSingleProject {
  id: number
  name: string
  description: string
  columns: iColumn[]
}

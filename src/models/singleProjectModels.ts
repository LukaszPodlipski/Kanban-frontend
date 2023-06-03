export interface Task {
  id: number
  name: string
  description: string
}

export interface Column {
  id: number
  name: string
  description: string
  color: string
  tasks: Task[]
}

export interface singleProject {
  id: number
  name: string
  description: string
  columns: Column[]
}

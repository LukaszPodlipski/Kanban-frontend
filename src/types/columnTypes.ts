export interface iColumn {
  id: number
  name: string
  color: string
  order: number
  type: 'start' | 'end' | null
  description: string
  isNew?: boolean
}

export interface iUpdateColumn {
  id: number | null
  name: string
  color: string
  order: number
  type: 'start' | 'end' | null
  description: string
  isNew?: boolean
  toDelete?: boolean
}

export class UpdateColumn implements iUpdateColumn {
  id: number | null
  name: string
  color: string
  order: number
  type: 'start' | 'end' | null
  description: string
  isNew?: boolean
  toDelete?: boolean

  constructor(column: iUpdateColumn) {
    this.id = column.id
    this.name = column.name
    this.color = column.color || '#000000'
    this.order = column.order
    this.type = column.type
    this.description = column.description
    this.isNew = column.isNew
    this.toDelete = false
  }
}

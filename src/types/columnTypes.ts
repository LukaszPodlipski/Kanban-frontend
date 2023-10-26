export interface iColumn {
  id: number
  name: string
  color: string
  order: number
  type: 'start' | 'end' | null
  description: string
  isNew?: boolean
}

export class Column implements iColumn {
  id: number
  name: string
  color: string
  order: number
  type: 'start' | 'end' | null
  description: string
  isNew?: boolean

  constructor(column: iColumn) {
    this.id = column.id
    this.name = column.name
    this.color = column.color || '#000000'
    this.order = column.order
    this.type = column.type
    this.description = column.description
    this.isNew = column.isNew
  }
}

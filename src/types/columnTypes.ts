export interface iColumn {
  id: number
  name: string
  description: string
  color: string
  order: number
}

export type iSimplifiedColumn = Pick<
  iColumn,
  'id' | 'name' | 'description' | 'color' | 'order'
>

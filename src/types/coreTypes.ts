import { iTask } from '@/types/taskTypes'

export type iTab = {
  name: string
  label: string
}

export type DialogParams = {
  title: string
  component: string
  item: iTask & { redirectedFromId?: number }
  hideHeader: boolean
  size: string
}

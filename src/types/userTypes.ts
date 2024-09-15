type roleType = 'Owner' | 'Maintainer' | 'Editor' | 'Viewer'

export interface iUser {
  id: number
  name: string
  surname: string
  fullName: string
  email: string
  avatarUrl: string
  role: roleType
  createdAt: string
}

export interface ISimplifiedUser {
  id: number
  fullName?: string
  avatarUrl: string
}

export type iMemberItem = {
  id: number
  name: string
  surname: string
  fullName: string
  email: string
  avatarUrl: string
  role: roleType
  createdAt: string
  userId: number
}

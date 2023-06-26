export interface ISimplifiedUser {
  id: number
  fullName?: string
  avatarUrl: string
}

export interface iUser {
  id: number
  name: string
  surname: string
  email: string
  avatarUrl: string
}

export interface iLoginResponse {
  token: string
  user: iUser
}
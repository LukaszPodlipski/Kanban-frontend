export interface ISimplifiedUser {
  id: number
  fullName?: string
}

export interface iUser {
  id: number
  name: string
  surname: string
  email: string
}

export interface iLoginResponse {
  token: string
  user: iUser
}
import { iUser } from './userTypes'

export interface iLoginResponse {
  token: string
  user: iUser
}

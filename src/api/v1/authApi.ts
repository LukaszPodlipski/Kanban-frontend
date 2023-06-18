import { axiosApi } from '../axios'

import { iLoginResponse } from '@/types/userTypes'

export const login = async (email: string, password: string): Promise<iLoginResponse>  => {
  const response = await axiosApi.post('/login', { email, password })
  return response.data
}

import { iLoginResponse } from '@/types/authTypes'

import { axiosApi } from '../axios'

const login = async (
  email: string,
  password: string,
): Promise<iLoginResponse> => {
  const response = await axiosApi.post('/login', { email, password })
  return response.data
}

export default {
  login,
}

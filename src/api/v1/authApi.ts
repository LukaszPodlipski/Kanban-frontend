import { axiosApi } from '../axios'

export const login = async (email: string, password: string) => {
  const response = await axiosApi.post('/login', { email, password })
  return response.data
}

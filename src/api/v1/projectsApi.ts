import { axiosApi } from '../axios'
import { iSingleProject } from '@/models/singleProjectTypes'

export const getProjectsList = async () => {
  const response = await axiosApi.get('/projects')
  return response.data
}

export const getSingleProject = async (id: string) => {
  const response = await axiosApi.get<iSingleProject>(`/projects/${id}`)
  return response.data
}

import { axiosApi } from '../axios'
import { iProject } from '@/types/projectTypes'

const getSingleProject = async (id: number) => {
  const response = await axiosApi.get<iProject>(`/projects/${id}`)
  return response.data
}

export default {
  getSingleProject,
}

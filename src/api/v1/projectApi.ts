import { iProject } from '@/types/projectTypes'

import { axiosApi } from '../axios'

const getSingleProject = async (id: number) => {
  const response = await axiosApi.get<iProject>(`/projects/${id}`)
  return response.data
}

export default {
  getSingleProject,
}

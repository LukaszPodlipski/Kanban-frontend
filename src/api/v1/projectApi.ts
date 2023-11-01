import { iProject, iSimplifiedProject } from '@/types/projectTypes'

import { axiosApi } from '../axios'

const getSingleProject = async (id: number) => {
  const response = await axiosApi.get<iProject>(`/projects/${id}`)
  return response.data
}

const updateProject = async (
  id: number,
  payload: Partial<iSimplifiedProject>,
) => {
  const response = await axiosApi.patch<iProject>(`/projects/${id}`, payload)
  return response.data
}

export default {
  updateProject,
  getSingleProject,
}

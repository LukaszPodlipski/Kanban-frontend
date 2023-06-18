import { axiosApi } from '../axios'
import { iProject } from '@/types/singleProjectTypes'
import { iProjectsMenuList } from '@/types/projectsListTypes'

const getProjectsList = async () => {
  const response = await axiosApi.get<iProjectsMenuList>('/projects')
  return response.data
}

const getSingleProject = async (id: number) => {
  const response = await axiosApi.get<iProject>(`/projects/${id}`)
  return response.data
}

export default {
  getProjectsList,
  getSingleProject,
}

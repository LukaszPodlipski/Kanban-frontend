import { iMemberItem } from '@/types/userTypes'

import { axiosApi } from '../axios'

type invitedMemberType = {
  id: number
  role: string
}

const checkMemberEmail = async (params: {
  email: string
  projectId: number
}): Promise<iMemberItem> => {
  const response = await axiosApi.get('/members/check_email', { params })
  return response.data
}

const inviteMembers = async (params: {
  users: invitedMemberType[]
  projectId: number
}): Promise<iMemberItem[]> => {
  const response = await axiosApi.post('/members/invite', params)
  return response.data
}

export default {
  checkMemberEmail,
  inviteMembers,
}

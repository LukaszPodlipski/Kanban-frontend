import membersApi from '@/api/v1/membersApi'
import { iMemberItem, iUser } from '@/types/userTypes'
import { defineStore } from 'pinia'

import { storeContructor } from './storeConstructor'

export const useMembersStore = defineStore('members', () => {
  const checkMemberEmail = async (params: {
    email: string
    projectId: number
  }): Promise<iMemberItem> => {
    const response = await membersApi.checkMemberEmail(params)
    return response
  }

  type invitedMemberType = {
    id: number
    role: string
  }

  const inviteMembers = async (params: {
    users: invitedMemberType[]
    projectId: number
  }): Promise<iMemberItem[]> => {
    const response = await membersApi.inviteMembers(params)
    return response
  }

  return {
    ...storeContructor<iUser, iUser>('members'),
    checkMemberEmail,
    inviteMembers,
  }
})

import membersApi from '@/api/v1/membersApi'
import { iMemberItem, iUser } from '@/types/userTypes'
import { falseLoadingState } from '@/utils/functions'
import { defineStore } from 'pinia'

import { storeContructor } from './storeConstructor'

export const useMembersStore = defineStore('members', () => {
  const { loadingItems, loadingItem } = storeContructor<iUser, iUser>('members')

  const checkMemberEmail = async (params: {
    email: string
    projectId: number
  }): Promise<iMemberItem> => {
    loadingItem.value = true
    const response = await membersApi
      .checkMemberEmail(params)
      .finally(async () => {
        loadingItem.value = await falseLoadingState()
      })
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
    loadingItem.value = true
    const response = await membersApi
      .inviteMembers(params)
      .finally(async () => {
        loadingItem.value = await falseLoadingState()
      })
    return response
  }

  return {
    ...storeContructor<iUser, iUser>('members'),
    loadingItems,
    loadingItem,
    checkMemberEmail,
    inviteMembers,
  }
})

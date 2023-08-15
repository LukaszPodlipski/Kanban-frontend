import { defineStore } from 'pinia'
import { ISimplifiedUser } from '@/types/userTypes'
import { storeContructor } from './storeConstructor'

export const useMembersStore = defineStore('members', () =>
  storeContructor<ISimplifiedUser,ISimplifiedUser>('members'),
)

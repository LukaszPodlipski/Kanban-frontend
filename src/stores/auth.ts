import { defineStore } from 'pinia'
import { ref, Ref } from 'vue'
import api from '@/api/v1/indexApi'
import { authorizeAxios } from '@/api/axios'
import { useRouter } from 'vue-router'
import { iLoginResponse } from '@/types/authTypes'
import { useWebsocketStore } from '@/stores/websocket'
import { useLayoutStore } from '@/stores/layout'
import { iUser } from '@/types/userTypes'

export const useAuthStore = defineStore('auth', () => {
  const user: Ref<iUser> = ref({} as iUser)
  const loading = ref<boolean>(false)
  const token = ref<string>('')

  const websocketStore = useWebsocketStore()
  const layoutStore = useLayoutStore()
  const router = useRouter()

  const isAuthorized = () => {
    return !!token.value && Object.keys(user.value).length
  }

  const setToken = (userToken: string) => {
    localStorage.setItem('KAN-Auth-Token', userToken)
    token.value = userToken
  }

  const setUser = (userData: any) => {
    localStorage.setItem('KAN-User', JSON.stringify(userData))
    user.value = userData
  }

  const clearAuth = () => {
    localStorage.removeItem('KAN-Auth-Token')
    localStorage.removeItem('KAN-User')
    token.value = ''
    user.value = {} as iUser
    layoutStore.setLayoutDefaultState()
  }

  const setAuth = (payload: iLoginResponse | null = null) => {
    const token = payload?.token || localStorage.getItem('KAN-Auth-Token')
    const user =
      payload?.user || JSON.parse(localStorage.getItem('KAN-User') || '{}')

    if (token && user) {
      setToken(token)
      authorizeAxios(token)
      setUser(user)
      websocketStore.connectWS()
    } else {
      logout()
    }
  }

  const logout = () => {
    clearAuth()
    router.push({ name: 'Login' })
  }

  const loginUser = async ({
    email,
    password,
  }: {
    email: string
    password: string
  }) => {
    try {
      loading.value = true
      const response = await api.login(email, password)
      setAuth(response)
      router.push({ name: 'Dashboard' })
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  return { user, loading, loginUser, token, setAuth, isAuthorized, logout }
})

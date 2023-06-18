import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login } from '@/api/v1/authApi'
import { authorizeAxios } from '@/api/axios'
import { useRouter } from 'vue-router'
import { iLoginResponse } from '@/types/userTypes'

export const useAuthStore = defineStore('auth', () => {
  const user = ref({})
  const loading = ref<boolean>(false)
  const token = ref<string>('')

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
    user.value = {}
  }

  const setAuth = (payload: iLoginResponse) => {
    const token = payload?.token || localStorage.getItem('KAN-Auth-Token')
    const user =
      payload?.user || JSON.parse(localStorage.getItem('KAN-User') || '{}')

    if (token && user) {
      setToken(token)
      authorizeAxios(token)
      setUser(user)
    } else {
      logout()
    }
  }

  const logout = () => {
    clearAuth()
    router.push({ name: 'Login' })
  }

  const loginUser = async (email: string, password: string) => {
    try {
      loading.value = true
      const response = await login(email, password)
      setAuth(response)
      router.push({ name: 'Projects' })
    } catch (error) {
      console.log(error)
    } finally {
      loading.value = false
    }
  }

  return { user, loading, loginUser, token, setAuth, isAuthorized, logout }
})

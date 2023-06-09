import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login } from '@/api/v1/authApi'
import { authorizeAxios } from '@/api/axios'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('KAN-User') || '') || {})
  const loading = ref<boolean>(false)
  const token = ref<string>(localStorage.getItem('KAN-Auth-Token') || '')

  const router = useRouter()

  const setToken = (userToken: string) => {
    localStorage.setItem('KAN-Auth-Token', userToken)
    token.value = userToken
  }

  const setUser = (userData: any) => {
    localStorage.setItem('KAN-User', JSON.stringify(userData))
    user.value = userData
  }

  const loginUser = async (email: string, password: string) => {
    try {
      loading.value = true
      const response = await login(email, password)
      setToken(response.token)
      setUser(response.user)
      authorizeAxios(response.token)
      router.push({ name: 'Projects' })
    } catch (error) {
      console.log(error)
    } finally {
      loading.value = false
    }
  }

  return { user, loading, loginUser, token }
})

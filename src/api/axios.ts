import axios, { AxiosInstance } from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useLayoutStore } from '@/stores/layout'

export const axiosApi: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/`,
  timeout: 5000,
  // Add any other configurations you need
  transformResponse: [
    function transformResponse(data) {
      return data ? JSON.parse(data) || {} : {}
    },
  ],
})

export function authorizeAxios(token: string): void {
  axiosApi.defaults.headers.common['Authorization'] = token
}

export function deauthorizeAxios() {
  delete axiosApi.defaults.headers.common['Authorization']
}

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore()
      const layoutStore = useLayoutStore()

      layoutStore.showToast({
        message: 'Please login to again',
        type: 'error',
      })
      authStore.logout()
    }
    if (error.response && error.response.status === 403) {
      const layoutStore = useLayoutStore()

      const errorMessage =
        error.response.data.error ||
        'You are not authorized to perform this action'

      layoutStore.showToast({
        message: errorMessage,
        type: 'error',
      })
    }
    return Promise.reject(error)
  },
)

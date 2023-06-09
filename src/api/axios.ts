import axios, { AxiosInstance } from 'axios'

export const axiosApi: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/`,
  timeout: 5000,
  // Add any other configurations you need
  transformResponse: [
    function transformResponse(data) {
      return JSON.parse(data)
    },
  ],
})

export function authorizeAxios(token: string) {
  axiosApi.defaults.headers.common['Authorization'] = token
}

export function deauthorizeAxios() {
  delete axiosApi.defaults.headers.common['Authorization']
}

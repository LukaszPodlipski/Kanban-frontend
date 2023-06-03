import axios, { AxiosInstance } from 'axios'

export const axiosApi = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/`, // Set your base URL here
    timeout: 5000, // Set a timeout value if desired
    // Add any other configurations you need
    transformResponse: [
      function transformResponse(data) {
        // Optionally you can check the response headers['content-type'] for application/json or text/json
        return JSON.parse(data)
      },
    ],
  })

  // You can also intercept requests or responses if needed
  instance.interceptors.request.use(
    (config) => {
      // Do something with the request config
      return config
    },
    (error) => {
      // Handle request error
      return Promise.reject(error)
    },
  )

  instance.interceptors.response.use(
    (response) => {
      // Do something with the response data
      return response
    },
    (error) => {
      // Handle response error
      return Promise.reject(error)
    },
  )

  return instance
}

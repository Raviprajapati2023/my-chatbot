import { defineBoot } from '#q-app/wrappers'
import axios, { HttpStatusCode, isAxiosError } from 'axios'
import { API_BASE } from 'src/services/endpoint'
import { $notify } from 'src/services/setup'

const api = axios.create({
  baseURL: API_BASE
})

const handleResponseSuccess = (res) => {
  const data = res?.data

  // For successful responses (200-299), return the data directly
  if (res.status >= 200 && res.status < 300) {
    return data
  }

  // For other status codes, still return data but log it
  console.log('Response with status:', res.status, data)
  return data
}

const handleResponseError = (error) => {
  if (isAxiosError(error)) {
    const status = error.response?.status
    const errorData = error?.response?.data
    const errorMessage = errorData?.error || errorData?.message || error.message

    console.log('API Error:', { status, errorData, errorMessage })

    // Show notification for errors
    $notify({ caption: errorMessage || 'Something went wrong!', type: 'negative' })

    if (status === HttpStatusCode.Unauthorized || status === HttpStatusCode.Forbidden) {
      // Handle unauthorized access
      localStorage.removeItem('accessToken')
      
      // Optional: Redirect to login page
      // window.location.href = '/sign-in'
    }

    // Return the error data so the calling code can handle it
    return Promise.reject(errorData || { error: errorMessage })
  }

  // fallback for non-Axios errors
  const fallbackError = { error: 'Unexpected error occurred.' }
  $notify({ caption: fallbackError.error, type: 'negative' })
  return Promise.reject(fallbackError)
}

api.interceptors.request.use(config => {
  // Add auth token if available
  const accessToken = localStorage.getItem('accessToken')
  
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

api.interceptors.response.use(handleResponseSuccess, handleResponseError)

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }

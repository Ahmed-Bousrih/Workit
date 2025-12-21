import axios, { AxiosError } from 'axios'
import { useToast } from 'vue-toastification'

const BASE_URL = import.meta.env.VITE_API_URL

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
})

// Inject token only for authenticated routes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    const toast = useToast()

    if (error.response) {
      // Server responded with error status
      const status = error.response.status
      const message =
        error.response.data?.message || error.response.data?.error || 'Une erreur est survenue'

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token')
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
          toast.error('Session expirée. Veuillez vous reconnecter.')
          break
        case 403:
          toast.error("Accès refusé. Vous n'avez pas les permissions nécessaires.")
          break
        case 404:
          toast.error('Ressource non trouvée.')
          break
        case 409:
          toast.error(message)
          break
        case 422:
          // Validation errors
          toast.error(message || 'Données invalides. Veuillez vérifier vos informations.')
          break
        case 500:
          toast.error('Erreur serveur. Veuillez réessayer plus tard.')
          break
        default:
          toast.error(message)
      }
    } else if (error.request) {
      // Request made but no response received
      toast.error('Impossible de contacter le serveur. Vérifiez votre connexion.')
    } else {
      // Something else happened
      toast.error('Une erreur inattendue est survenue.')
    }

    return Promise.reject(error)
  },
)

// Public API (NO token ever)
export const publicApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

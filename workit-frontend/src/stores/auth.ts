import { defineStore } from 'pinia'
import { api } from '@/services/api'
import router from '@/router'
import { jwtDecode } from 'jwt-decode'

type JwtPayload = {
  userId: number
  role: 'hr' | 'candidate' | 'super_admin'
  exp?: number
  iat?: number
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
  }),

  getters: {
    isTokenExpired(): boolean {
      if (!this.token) return true
      try {
        const decoded = jwtDecode<JwtPayload>(this.token)
        if (!decoded.exp) return true
        // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
        return decoded.exp * 1000 < Date.now()
      } catch {
        return true
      }
    },
  },

  actions: {
    async login(email: string, password: string) {
      const res = await api.post('/auth/login', { email, password })
      this.token = res.data.access_token
      localStorage.setItem('token', this.token)

      const decoded = jwtDecode<JwtPayload>(this.token)

      // 🔁 Redirect based on role
      if (decoded.role === 'hr') {
        router.push('/admin/dashboard')
      } else if (decoded.role === 'super_admin') {
        router.push('/superadmin')
      } else {
        router.push('/candidate/dashboard') // or candidate area
      }
    },

    async register(email: string, password: string) {
      const res = await api.post('/auth/register', { email, password })
      return res.data
    },

    logout() {
      this.token = ''
      localStorage.removeItem('token')
      router.push('/login')
    },

    isLoggedIn() {
      if (!this.token) return false
      // Check if token is expired
      if (this.isTokenExpired) {
        this.logout()
        return false
      }
      return true
    },
  },
})

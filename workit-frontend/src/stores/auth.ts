import { defineStore } from 'pinia'
import { api } from '@/services/api'
import router from '@/router'
import { jwtDecode } from 'jwt-decode'

type JwtPayload = {
  userId: number
  role: 'hr' | 'candidate' | 'super_admin'
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
  }),

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
      return !!this.token
    },
  },
})

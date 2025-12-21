<template>
  <header class="bg-[#1e2a38] dark:bg-slate-800 px-6 py-4 shadow flex justify-between items-center">
    <router-link to="/admin/dashboard">
      <img src="@/assets/logo.png" alt="WorkIt Logo" class="w-36 cursor-pointer" />
    </router-link>
    <div class="flex items-center gap-4">
      <!-- Dark Mode Toggle Button -->
      <button @click="toggleDark" class="text-white hover:text-cyan-400 transition text-xl">
        <span v-if="isDark">☀️</span>
        <span v-else>🌙</span>
      </button>

      <!-- Logout Button -->
      <button
        @click.prevent="logout"
        class="text-white hover:text-orange-400 font-medium transition"
      >
        Déconnexion
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useDarkMode } from '@/composables/useDarkMode'

const auth = useAuthStore()
const router = useRouter()
const toast = useToast()
const { isDark, toggleDark } = useDarkMode()

const logout = () => {
  toast.success('Déconnecté avec succès')
  localStorage.removeItem('token')
  auth.logout()
  router.push('/')
}
</script>

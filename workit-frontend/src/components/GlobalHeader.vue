<template>
  <header class="bg-slate-800 text-white shadow-md">
    <div class="max-w-7xl mx-auto flex items-center justify-between p-4">
      <RouterLink to="/" class="flex items-center gap-2">
        <img src="@/assets/logo.png" alt="WorkIt Logo" class="h-10 w-auto" />
      </RouterLink>

      <!-- Mobile menu button -->
      <button @click="menuOpen = !menuOpen" class="md:hidden text-2xl focus:outline-none">
        ☰
      </button>

      <!-- Desktop nav -->
      <nav class="hidden md:flex gap-4 items-center">
        <RouterLink to="/" class="hover:text-cyan-400 hover:underline">Accueil</RouterLink>
        <RouterLink to="/jobs" class="hover:text-cyan-400 hover:underline">Offres</RouterLink>
        <button @click="toggleDark" class="hover:text-cyan-400 transition text-lg">
          <span v-if="isDark">☀️</span>
          <span v-else>🌙</span>
        </button>
        <template v-if="isLoggedIn">
          <RouterLink to="/dashboard" class="hover:text-cyan-400">Mon espace</RouterLink>
          <button @click="logout" class="hover:text-orange-400">Déconnexion</button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-1 rounded shadow transition">Se connecter</RouterLink>
          <RouterLink to="/signup" class="bg-orange-500 hover:bg-orange-400 text-white px-4 py-1 rounded shadow transition">Créer un compte</RouterLink>
        </template>
      </nav>
    </div>

    <!-- Mobile nav -->
    <div v-if="menuOpen" class="flex flex-col gap-4 px-4 pb-4 md:hidden bg-slate-800 text-white shadow-md">
      <RouterLink to="/" class="hover:text-cyan-400 hover:underline">Accueil</RouterLink>
      <RouterLink to="/jobs" class="hover:text-cyan-400 hover:underline">Offres</RouterLink>
      <button @click="toggleDark" class="hover:text-cyan-400 transition text-lg text-left">
        <span v-if="isDark">☀️</span>
        <span v-else>🌙</span>
      </button>
      <template v-if="isLoggedIn">
        <RouterLink to="/dashboard" class="hover:text-cyan-400">Mon espace</RouterLink>
        <button @click="logout" class="hover:text-orange-400 text-left">Déconnexion</button>
      </template>
      <template v-else>
        <RouterLink to="/login" class="bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-1 rounded shadow transition">Se connecter</RouterLink>
        <RouterLink to="/signup" class="bg-orange-500 hover:bg-orange-400 text-white px-4 py-1 rounded shadow transition">Créer un compte</RouterLink>
      </template>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { ref } from 'vue'
import { useDarkMode } from '@/composables/useDarkMode'
import { useToast } from "vue-toastification"
import { useAuthStore } from "@/stores/auth";

const isLoggedIn = ref(!!localStorage.getItem('token'))
const router = useRouter()
const { isDark, toggleDark } = useDarkMode()
const toast = useToast()
const auth = useAuthStore()
const menuOpen = ref(false)

function logout() {
  auth.logout();
  toast.success("Déconnecté avec succès")
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

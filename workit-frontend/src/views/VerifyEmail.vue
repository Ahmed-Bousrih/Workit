<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-900 text-center text-slate-800 dark:text-slate-100 px-4"
  >
    <h1 class="text-3xl font-bold mb-6 text-cyan-700 dark:text-cyan-400">
      Vérification de l'email
    </h1>

    <p v-if="loading" class="text-slate-500">Vérification en cours...</p>
    <p v-else-if="success" class="text-green-600 text-lg">
      Votre adresse a été confirmée avec succès ✅
    </p>
    <p v-else class="text-red-600 text-lg">Lien invalide ou expiré ❌</p>

    <router-link
      to="/login"
      class="mt-6 text-cyan-600 underline hover:opacity-80 text-sm"
    >
      Retour à la connexion
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { publicApi } from '@/services/api'

const route = useRoute()
const loading = ref(true)
const success = ref(false)

onMounted(async () => {
  const token = route.params.token
  try {
    await publicApi.get(`/auth/verify-email/${token}`)
    success.value = true
  } catch {
    success.value = false
  } finally {
    loading.value = false
  }
})
</script>

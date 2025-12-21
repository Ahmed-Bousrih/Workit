<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-[#1e2a38] px-4 text-center"
  >
    <div
      class="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md text-slate-800"
    >
      <h2 class="text-2xl font-bold mb-4">Réinitialiser votre mot de passe</h2>
      <p class="text-sm mb-6 text-gray-600">
        Entrez votre adresse email pour recevoir un lien de réinitialisation.
      </p>

      <form @submit.prevent="requestReset" class="space-y-4">
        <input
          v-model="email"
          type="email"
          required
          placeholder="adresse@exemple.com"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button
          type="submit"
          class="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-xl transition"
        >
          Envoyer le lien
        </button>
        <p v-if="success" class="text-green-600 text-sm">{{ success }}</p>
        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { publicApi } from '@/services/api'

const email = ref('')
const success = ref('')
const error = ref('')

const requestReset = async () => {
  success.value = ''
  error.value = ''
  try {
    await publicApi.post('/auth/request-password-reset', { email: email.value })
    success.value = '📩 Un lien vous a été envoyé par email.'
  } catch {
    error.value = '❌ Erreur ou email inconnu.'
  }
}
</script>

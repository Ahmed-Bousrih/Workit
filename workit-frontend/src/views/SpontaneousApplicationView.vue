<template>
  <div class="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
    <GlobalHeader />

    <main class="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <h2 class="text-3xl font-bold text-center text-cyan-700 dark:text-cyan-400">
        🎯 Candidature Spontanée
      </h2>

      <form @submit.prevent="submitApplication" class="space-y-4">
        <label for="coverletter" class="block font-medium">Lettre de motivation (facultatif)</label>
        <textarea
          id="coverletter"
          v-model="coverletter"
          rows="6"
          placeholder="Expliquez votre motivation ou laissez vide"
          class="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white bg-white dark:bg-slate-700 placeholder-gray-400 dark:placeholder-gray-500 resize-none"
        />

        <button
          type="submit"
          class="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded transition"
        >
          Envoyer
        </button>
      </form>

      <div class="text-center mt-6">
        <RouterLink to="/" class="text-cyan-600 hover:underline text-sm">← Retour à l'accueil</RouterLink>
      </div>
    </main>

    <GlobalFooter />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalFooter from '@/components/GlobalFooter.vue'
import { api } from '@/services/api'

const toast = useToast()
const router = useRouter()

const coverletter = ref('')

const submitApplication = async () => {
  try {
    await api.post('/applications/spontaneous', {
      coverletter: coverletter.value || null
    })
    toast.success('Candidature spontanée envoyée 🎉')
    router.push('/') // or to a dashboard route
  } catch (err) {
    toast.error('Erreur lors de l’envoi ❌')
    console.error(err)
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
  >
    <GlobalHeader />

    <main class="max-w-3xl mx-auto px-4 py-12 space-y-10">
      <h2 class="text-3xl font-bold text-center">⚙️ Paramètres du compte</h2>

      <!-- Change Password (Expandable Section) -->
      <section class="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl shadow">
        <div
          class="flex justify-between items-center cursor-pointer"
          @click="showPasswordForm = !showPasswordForm"
        >
          <h3 class="text-xl font-semibold">Changer le mot de passe</h3>
          <span class="text-cyan-600">{{ showPasswordForm ? '−' : '+' }}</span>
        </div>

        <div v-if="showPasswordForm" class="mt-6 space-y-4">
          <form @submit.prevent="handlePasswordChange" class="space-y-4">
            <div class="relative">
              <label class="block text-sm font-medium mb-1"
                >Mot de passe actuel</label
              >
              <input
                :type="showCurrent ? 'text' : 'password'"
                v-model="currentPassword"
                required
                class="w-full px-4 py-2 pr-10 rounded border border-gray-300 focus:ring-cyan-500 focus:outline-none text-slate-900 dark:text-white bg-white dark:bg-slate-700 placeholder-gray-400 dark:placeholder-gray-500"
              />
              <button
                type="button"
                @click="showCurrent = !showCurrent"
                class="absolute right-3 top-[2.3rem] text-gray-500 hover:text-cyan-600"
              >
                <component :is="showCurrent ? EyeOff : Eye" class="w-5 h-5" />
              </button>
            </div>

            <div class="relative">
              <label class="block text-sm font-medium mb-1"
                >Nouveau mot de passe</label
              >
              <input
                :type="showNew ? 'text' : 'password'"
                v-model="newPassword"
                required
                class="w-full px-4 py-2 pr-10 rounded border border-gray-300 focus:ring-cyan-500 focus:outline-none text-slate-900 dark:text-white bg-white dark:bg-slate-700 placeholder-gray-400 dark:placeholder-gray-500"
              />
              <button
                type="button"
                @click="showNew = !showNew"
                class="absolute right-3 top-[2.3rem] text-gray-500 hover:text-cyan-600"
              >
                <component :is="showNew ? EyeOff : Eye" class="w-5 h-5" />
              </button>
            </div>

            <div class="relative">
              <label class="block text-sm font-medium mb-1"
                >Confirmer le mot de passe</label
              >
              <input
                :type="showConfirm ? 'text' : 'password'"
                v-model="confirmPassword"
                required
                class="w-full px-4 py-2 pr-10 rounded border border-gray-300 focus:ring-cyan-500 focus:outline-none text-slate-900 dark:text-white bg-white dark:bg-slate-700 placeholder-gray-400 dark:placeholder-gray-500"
              />
              <button
                type="button"
                @click="showConfirm = !showConfirm"
                class="absolute right-3 top-[2.3rem] text-gray-500 hover:text-cyan-600"
              >
                <component :is="showConfirm ? EyeOff : Eye" class="w-5 h-5" />
              </button>
            </div>

            <button
              type="submit"
              class="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded transition"
            >
              Mettre à jour le mot de passe
            </button>
          </form>
        </div>
      </section>

      <!-- Delete Account -->
      <section
        class="bg-red-100 dark:bg-red-900 p-6 rounded-xl shadow text-red-800 dark:text-red-200"
      >
        <h3 class="text-xl font-semibold mb-4">❌ Supprimer le compte</h3>
        <p class="text-sm mb-4">
          Cette action est <strong>irréversible</strong>. Toutes vos données
          seront supprimées définitivement.
        </p>

        <div v-if="!confirmDeleteVisible">
          <button
            @click="confirmDeleteVisible = true"
            class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Supprimer mon compte
          </button>
        </div>

        <div
          v-else
          class="bg-white dark:bg-slate-800 text-slate-800 dark:text-white p-4 rounded-xl mt-4 space-y-4"
        >
          <p class="text-sm font-medium text-center">
            Merci de confirmer les éléments suivants avant la suppression de
            votre compte.
          </p>
          <label class="flex items-start gap-2">
            <input type="checkbox" v-model="confirmIrreversible" class="mt-1" />
            <span>Je comprends que cette action est irréversible.</span>
          </label>
          <label class="flex items-start gap-2">
            <input type="checkbox" v-model="confirmDataLoss" class="mt-1" />
            <span
              >Je consens à la suppression de toutes mes données et de mon
              compte.</span
            >
          </label>

          <div class="flex gap-3 justify-center">
            <button
              :disabled="!canDelete"
              @click="handleDeleteAccount"
              class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition disabled:bg-red-300 disabled:cursor-not-allowed"
            >
              Confirmer la suppression
            </button>
            <button
              @click="confirmDeleteVisible = false"
              class="text-sm text-gray-600 dark:text-gray-300 hover:underline"
            >
              Annuler
            </button>
          </div>
        </div>
      </section>

      <section class="text-center">
        <RouterLink to="/" class="text-cyan-600 hover:underline text-sm">
          ← Retour au tableau de bord
        </RouterLink>
      </section>
    </main>

    <GlobalFooter />
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalFooter from '@/components/GlobalFooter.vue'
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { Eye, EyeOff } from 'lucide-vue-next'
import type { AxiosError } from 'axios'

const toast = useToast()
const router = useRouter()
const auth = useAuthStore()

const showPasswordForm = ref(false)
const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const handlePasswordChange = async () => {
  if (newPassword.value !== confirmPassword.value) {
    toast.error('Les mots de passe ne correspondent pas.')
    return
  }

  try {
    await api.post('/auth/change-password', {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
    })

    toast.success('Mot de passe mis à jour ✅')
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    showPasswordForm.value = false
  } catch (err) {
    const axiosErr = err as AxiosError<{ message?: string }>
    const msg =
      axiosErr.response?.data?.message || 'Erreur lors de la mise à jour'
    toast.error(msg)
  }
}

// Delete account
const confirmDeleteVisible = ref(false)
const confirmIrreversible = ref(false)
const confirmDataLoss = ref(false)

const canDelete = computed(
  () => confirmIrreversible.value && confirmDataLoss.value,
)
const handleDeleteAccount = async () => {
  try {
    await api.delete('/auth/profile')
    toast.success('Compte supprimé avec succès.')
    auth.logout()
    router.push('/')
  } catch (err) {
    const axiosErr = err as AxiosError<{ message?: string }>
    toast.error(
      axiosErr.response?.data?.message || 'Erreur lors de la suppression.',
    )
  }
}
</script>

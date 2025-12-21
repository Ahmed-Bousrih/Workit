<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-[#1e2a38] px-4"
  >
    <router-link to="/" class="mb-8 mt-8">
      <img src="@/assets/logo.png" alt="WorkIt Logo" class="w-40 mb-8" />
    </router-link>

    <div class="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">
        Créer un compte
      </h2>

      <form @submit.prevent="handleSignup">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Adresse email</label
          >
          <input
            v-model="email"
            type="email"
            required
            placeholder="adresse@exemple.com"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <p v-if="emailError" class="text-red-500 text-sm mt-1">
            {{ emailError }}
          </p>
        </div>

        <div class="mb-4 relative">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Mot de passe</label
          >
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            required
            placeholder="Votre mot de passe"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 pr-10"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-9 text-gray-500 hover:text-cyan-600"
          >
            <component :is="showPassword ? EyeOff : Eye" class="w-5 h-5" />
          </button>
          <p v-if="passwordError" class="text-red-500 text-sm mt-1">
            {{ passwordError }}
          </p>
        </div>

        <div class="mb-4 relative">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Confirmer le mot de passe</label
          >
          <input
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            required
            placeholder="Répéter le mot de passe"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 pr-10"
          />
          <button
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            class="absolute right-3 top-9 text-gray-500 hover:text-cyan-600"
          >
            <component
              :is="showConfirmPassword ? EyeOff : Eye"
              class="w-5 h-5"
            />
          </button>
          <p v-if="confirmPasswordError" class="text-red-500 text-sm mt-1">
            {{ confirmPasswordError }}
          </p>
        </div>

        <div class="mb-4 text-sm text-gray-600">
          <label class="flex items-start gap-2">
            <input type="checkbox" v-model="agreed" class="mt-1" />
            <span>
              J'accepte les
              <router-link
                to="/mentions-legales"
                class="text-cyan-600 underline"
                >conditions générales</router-link
              >
              et la
              <router-link to="/privacy-policy" class="text-cyan-600 underline"
                >politique de confidentialité</router-link
              >.
            </span>
          </label>
          <p v-if="agreedError" class="text-red-500 text-sm mt-1">
            {{ agreedError }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="!isFormValid"
          class="w-full font-bold py-2 px-4 rounded-xl transition text-white bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          S'inscrire
        </button>

        <p v-if="formError" class="text-red-500 text-center text-sm mt-4">
          {{ formError }}
        </p>

        <p class="mt-6 text-sm text-center text-gray-600">
          Vous avez déjà un compte ?
          <router-link
            to="/login"
            class="text-cyan-600 font-semibold hover:underline"
            >Connectez-vous</router-link
          >
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import router from '@/router'
import { Eye, EyeOff } from 'lucide-vue-next'

const toast = useToast()
const auth = useAuthStore()

const agreed = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/

const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')
const agreedError = ref('')
const formError = ref('')
const confirmPassword = ref('')
const confirmPasswordError = ref('')

const isFormValid = computed(() => {
  return (
    email.value &&
    password.value &&
    confirmPassword.value &&
    password.value === confirmPassword.value &&
    agreed.value
  )
})

const handleSignup = async () => {
  emailError.value = ''
  passwordError.value = ''
  agreedError.value = ''
  formError.value = ''

  if (!email.value.includes('@') || !email.value.includes('.')) {
    emailError.value = 'Adresse email invalide'
  }

  if (password.value.length < 6) {
    passwordError.value = 'Le mot de passe doit contenir au moins 6 caractères'
  }

  if (!agreed.value) {
    agreedError.value = 'Vous devez accepter les conditions pour continuer'
  }

  if (!strongPasswordRegex.test(password.value)) {
    passwordError.value =
      'Le mot de passe doit contenir au moins 8 caractères avec majuscule, minuscule, chiffre et caractère spécial.'
  }

  confirmPasswordError.value = ''

  if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Les mots de passe ne correspondent pas'
  }

  if (
    emailError.value ||
    passwordError.value ||
    agreedError.value ||
    confirmPasswordError.value
  )
    return

  try {
    await auth.register(email.value, password.value)
    toast.success(
      'Compte créé avec succès ✅ Un email de confirmation vous a été envoyé.',
    )
    router.push('/login')
  } catch (err: unknown) {
    const axiosErr = err as AxiosError<{ message?: string }>
    const backendMessage = axiosErr?.response?.data?.message

    formError.value =
      backendMessage ?? "Erreur lors de l'inscription. Veuillez réessayer."
    toast.error(formError.value)
  }
}
</script>

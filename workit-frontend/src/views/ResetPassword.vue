<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-[#1e2a38] px-4 text-center">
    <div class="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md text-slate-800">
      <h2 class="text-2xl font-bold mb-4">Nouveau mot de passe</h2>
      <p class="text-sm text-gray-600 mb-6">Entrez votre nouveau mot de passe ci-dessous.</p>

      <form @submit.prevent="submit" class="space-y-4">
        <div class="relative">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            required
            placeholder="Nouveau mot de passe"
            class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-2 top-2.5 text-gray-600 hover:text-gray-800"
            aria-label="Afficher ou masquer le mot de passe"
          >
            <Eye v-if="showPassword" class="w-5 h-5" />
            <EyeOff v-else class="w-5 h-5" />
          </button>
        </div>

        <div class="relative">
          <input
            :type="showConfirm ? 'text' : 'password'"
            v-model="confirmPassword"
            required
            placeholder="Confirmer le mot de passe"
            class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            type="button"
            @click="showConfirm = !showConfirm"
            class="absolute right-2 top-2.5 text-gray-600 hover:text-gray-800"
            aria-label="Afficher ou masquer la confirmation"
          >
            <Eye v-if="showConfirm" class="w-5 h-5" />
            <EyeOff v-else class="w-5 h-5" />
          </button>
        </div>

        <button
          type="submit"
          class="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-xl transition"
        >
          Réinitialiser le mot de passe
        </button>

        <p v-if="success" class="text-green-600 text-sm">{{ success }}</p>
        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { publicApi } from '@/services/api';
import { Eye, EyeOff } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const password = ref('');
const confirmPassword = ref('');
const success = ref('');
const error = ref('');
const showPassword = ref(false);
const showConfirm = ref(false);

const submit = async () => {
  error.value = '';
  success.value = '';

  if (password.value !== confirmPassword.value) {
    error.value = 'Les mots de passe ne correspondent pas';
    return;
  }

  if (!strongPasswordRegex.test(password.value)) {
    error.value =
      'Le mot de passe doit contenir au moins 8 caractères avec majuscule, minuscule, chiffre et caractère spécial.';
    return;
  }

  try {
    await publicApi.post(`/auth/reset-password/${route.params.token}`, {
      password: password.value,
    });
    success.value = 'Mot de passe réinitialisé avec succès 🎉';
    setTimeout(() => router.push('/login'), 2000);
  } catch {
    error.value = 'Lien expiré ou invalide ❌';
  }
};
</script>

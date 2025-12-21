<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-[#1e2a38] px-4">
    <router-link to="/" class="mb-8">
      <img src="@/assets/logo.png" alt="WorkIt Logo" class="w-40 mb-8" />
    </router-link>
    <div class="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">
        Connexion à WorkIt
      </h2>

      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="adresse@exemple.com"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <p v-if="emailError" class="text-red-500 text-sm mt-1">{{ emailError }}</p>
        </div>

        <div class="mb-6 relative">
          <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            required
            placeholder="Votre Mot de passe"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 pr-10"
          />
          <button
            type="button"
            @click="togglePassword"
            class="absolute right-2 top-9 text-gray-600 hover:text-gray-800"
            aria-label="Afficher ou masquer le mot de passe"
          >
            <Eye v-if="showPassword" class="w-5 h-5" />
            <EyeOff v-else class="w-5 h-5" />
          </button>
          <p v-if="passwordError" class="text-red-500 text-sm mt-1">{{ passwordError }}</p>
        </div>

        <button
          type="submit"
          class="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-xl transition"
        >
          Se Connecter
        </button>

        <p class="mt-4 text-sm text-center">
          <router-link to="/forgot-password" class="text-cyan-600 hover:underline">
            Mot de passe oublié ?
          </router-link>
        </p>

        <p v-if="formError" class="text-red-500 text-center text-sm mt-4">
          {{ formError }}
        </p>

        <p class="mt-6 text-sm text-center text-gray-600">
          Vous n'avez pas de compte ?
          <router-link to="/signup" class="text-cyan-600 font-semibold hover:underline">
            Créer un compte
          </router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "vue-toastification";
import { jwtDecode } from "jwt-decode";
import router from "@/router";
import type { AxiosError } from "axios";
import { Eye, EyeOff } from 'lucide-vue-next';

const toast = useToast();
const auth = useAuthStore();

const email = ref("");
const password = ref("");
const emailError = ref("");
const passwordError = ref("");
const formError = ref("");
const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

interface JwtPayload {
  role: 'hr' | 'candidate' | 'super_admin';
  userId: number;
}

const handleLogin = async () => {
  emailError.value = "";
  passwordError.value = "";
  formError.value = "";

  if (!email.value.includes("@") || !email.value.includes(".")) {
    emailError.value = "Adresse email invalide";
  }

  if (password.value.length < 6) {
    passwordError.value = "Le mot de passe doit contenir au moins 6 caractères";
  }

  if (emailError.value || passwordError.value) return;

  try {
    await auth.login(email.value, password.value);
    toast.success("Connexion réussie ✅");

    const decoded = jwtDecode<JwtPayload>(auth.token);
      if (decoded.role === "super_admin") {
        router.push("/superadmin");
      } else if (decoded.role === "hr") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
  } catch (err: unknown) {
    const axiosErr = err as AxiosError<{ message?: string }>;
    formError.value =
      axiosErr?.response?.data?.message ??
      "Échec de connexion. Veuillez vérifier vos identifiants.";
    toast.error(formError.value);
  }
};
</script>

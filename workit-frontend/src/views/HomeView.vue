<template>
  <div
    class="min-h-screen bg-white text-slate-800 flex flex-col dark:bg-slate-900 dark:text-slate-100"
  >
    <!-- GlobalHeader locally included -->
    <GlobalHeader />

    <main
      class="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center"
    >
      <!-- Hero Welcome -->
      <h2 class="text-4xl font-bold mb-6 text-[#1C1E26] dark:text-white">
        Bienvenue sur la plateforme de recrutement MedTrust
      </h2>

      <p
        class="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-12 text-lg"
      >
        Cette plateforme est exclusivement dédiée au recrutement interne de
        MedTrust.<br />
        Découvrez les opportunités qui vous attendent et rejoignez une
        entreprise engagée et innovante.
      </p>

      <!-- MedTrust Logo Placeholder -->
      <!-- <img src="@/assets/logo-placeholder.svg" alt="Logo MedTrust" class="mx-auto w-32 mb-6" /> -->

      <!-- Hero Section -->
      <!-- <h2 class="text-4xl font-bold text-center text-cyan-700 dark:text-cyan-400 mb-6">
        Rejoignez MedTrust
      </h2> -->

      <img
        src="@/assets/illustration.svg?url"
        alt="Illustration de la plateforme"
        class="mx-auto w-full max-w-lg mb-16"
      />

      <!-- Features Section -->
      <div class="grid md:grid-cols-3 gap-8 mb-16">
        <div
          class="p-6 bg-slate-100 dark:bg-slate-800 rounded-2xl shadow hover:shadow-lg transition"
        >
          <h3
            class="font-semibold text-xl text-cyan-700 dark:text-cyan-400 mb-2"
          >
            Opportunités Diversifiées
          </h3>
          <p class="dark:text-slate-300">
            Des postes adaptés à différents profils et parcours, au sein des
            équipes MedTrust.
          </p>
        </div>
        <div
          class="p-6 bg-slate-100 dark:bg-slate-800 rounded-2xl shadow hover:shadow-lg transition"
        >
          <h3
            class="font-semibold text-xl text-cyan-700 dark:text-cyan-400 mb-2"
          >
            Recrutement Simplifié
          </h3>
          <p class="dark:text-slate-300">
            Postulez rapidement et suivez vos candidatures en toute
            transparence.
          </p>
        </div>
        <div
          class="p-6 bg-slate-100 dark:bg-slate-800 rounded-2xl shadow hover:shadow-lg transition"
        >
          <h3
            class="font-semibold text-xl text-cyan-700 dark:text-cyan-400 mb-2"
          >
            Accès Sécurisé
          </h3>
          <p class="dark:text-slate-300">
            Connexion simple et sécurisée pour les candidats et les recruteurs
            internes.
          </p>
        </div>
      </div>

      <!-- Stats Section -->
      <div
        class="flex flex-col sm:flex-row justify-center gap-12 text-cyan-700 dark:text-cyan-400 font-semibold text-center"
      >
        <div>
          <p class="text-4xl">+{{ stats.jobs || '...' }}</p>
          <p class="text-slate-600 dark:text-slate-300 mt-2">
            Offres disponibles
          </p>
        </div>
        <div>
          <p class="text-4xl">+{{ stats.candidates || '...' }}</p>
          <p class="text-slate-600 dark:text-slate-300 mt-2">
            Candidats inscrits
          </p>
        </div>
      </div>
    </main>

    <!-- GlobalFooter locally included -->
    <GlobalFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalFooter from '@/components/GlobalFooter.vue'
import { publicApi } from '@/services/api'

const stats = ref({
  jobs: 0,
  candidates: 0,
})

const loadStats = async () => {
  try {
    const jobRes = await publicApi.get('/jobs/count')
    const userRes = await publicApi.get('/public/users/count?role=candidate')

    stats.value.jobs = jobRes.data.total
    stats.value.candidates = userRes.data.total
  } catch (err) {
    console.error('Erreur lors du chargement des statistiques', err)
  }
}
onMounted(loadStats)
</script>

<template>
  <div
    class="min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
  >
    <GlobalHeader />

    <main class="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 class="text-4xl font-bold mb-8 text-center">
        📋 Offres d'emploi disponibles
      </h2>

      <div
        v-if="loading"
        class="text-center text-slate-500 dark:text-slate-400 py-10"
      >
        Chargement des offres...
      </div>

      <div
        v-else-if="jobs.length === 0"
        class="text-center text-slate-500 dark:text-slate-400 py-10"
      >
        Aucune offre disponible pour le moment.
      </div>

      <div v-else class="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Spontaneous Application Card (only if logged in) -->
        <div
          v-if="isLoggedIn"
          class="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl shadow hover:shadow-lg transition border-2 border-dashed border-emerald-500"
        >
          <h3
            class="text-xl font-semibold text-emerald-700 dark:text-emerald-400 mb-2"
          >
            🚀 Candidature Spontanée
          </h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Aucune offre ne correspond à votre profil ? Vous pouvez toujours
            envoyer une candidature spontanée.
          </p>
          <RouterLink
            to="/apply/spontaneous"
            class="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded transition"
          >
            Postuler spontanément
          </RouterLink>
        </div>

        <!-- Regular Job Cards -->
        <div
          v-for="job in jobs"
          :key="job.id"
          class="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <h3
            class="text-xl font-semibold text-cyan-700 dark:text-cyan-400 mb-2 truncate"
          >
            {{ job.title }}
          </h3>
          <p
            class="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4"
          >
            {{ job.descriptionGeneral }}
          </p>
          <RouterLink
            :to="`/jobs/${job.id}`"
            class="inline-block mt-auto bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded transition"
          >
            Voir l'offre
          </RouterLink>
        </div>
      </div>
    </main>

    <GlobalFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalFooter from '@/components/GlobalFooter.vue'
import { api } from '@/services/api'
import type { Job } from '@/types/job'
import { useAuthStore } from '@/stores/auth'

const jobs = ref<Job[]>([])
const loading = ref(true)
const auth = useAuthStore()
const isLoggedIn = computed(() => !!auth.token)

const loadJobs = async () => {
  try {
    const res = await api.get('/jobs')
    jobs.value = res.data
  } catch (err) {
    console.error('Erreur lors du chargement des offres', err)
  } finally {
    loading.value = false
  }
}

onMounted(loadJobs)
</script>

<style scoped>
.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-clamp: 3;
}
</style>

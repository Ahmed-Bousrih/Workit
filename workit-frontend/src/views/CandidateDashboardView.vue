<template>
  <div class="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
    <GlobalHeader />

    <main class="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <!-- Greeting + Profile Access -->
      <section class="text-center space-y-3">
        <h2 class="text-3xl font-bold mb-2">Bienvenue {{ user?.profile?.firstName || 'Candidat' }}</h2>

        <div class="flex flex-col sm:flex-row justify-center gap-3">
          <RouterLink
            to="/profile"
            class="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Mon Profil
          </RouterLink>

          <RouterLink
            to="/account-settings"
            class="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Paramètres
          </RouterLink>

          <RouterLink
            to="/apply/spontaneous"
            class="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Candidature Spontanée
          </RouterLink>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
        <div class="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl shadow">
          <p class="text-4xl font-bold text-cyan-600 dark:text-cyan-400">+{{ stats.jobs }}</p>
          <p class="mt-2 text-slate-600 dark:text-slate-300">Offres disponibles</p>
        </div>
        <div class="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl shadow">
          <p class="text-4xl font-bold text-cyan-600 dark:text-cyan-400">+{{ stats.myApplications }}</p>
          <p class="mt-2 text-slate-600 dark:text-slate-300">Candidatures envoyées</p>
        </div>
      </section>

      <!-- Recent Applications -->
      <section>
        <h3 class="text-xl font-bold mb-4">Mes 3 dernières candidatures</h3>

        <div v-if="recentApps.length" class="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div
            v-for="app in sortedApps"
            :key="app.id"
            @click="openModal(app)"
            class="cursor-pointer bg-slate-100 dark:bg-slate-800 p-4 rounded-xl shadow hover:ring-2 hover:ring-cyan-500 transition"
          >
            <p class="font-semibold truncate">
              <template v-if="app.job">
                <RouterLink
                  :to="`/jobs/${app.job.id}`"
                  class="text-cyan-600 dark:text-cyan-400 hover:underline"
                  @click.stop
                >
                  {{ app.job.title }}
                </RouterLink>
              </template>
              <template v-else>
                Candidature Spontanée
              </template>
            </p>
            <p class="text-sm text-slate-500 dark:text-slate-400">Soumise le {{ formatDate(app.appliedAt) }}</p>
            <span
              class="inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full"
              :class="{
                'bg-yellow-100 text-yellow-700': app.status === 'pending',
                'bg-green-100 text-green-700': app.status === 'reviewed',
                'bg-red-100 text-red-700': app.status === 'rejected',
              }"
            >
            {{ app.status === 'pending' ? 'En attente' : app.status === 'reviewed' ? 'Étape suivante' : 'Rejetée' }}
            </span>
          </div>
        </div>

        <p v-else class="text-sm text-slate-500 dark:text-slate-400">Aucune candidature trouvée.</p>

        <div class="mt-6 text-center">
          <RouterLink
            to="/applications"
            class="text-cyan-600 dark:text-cyan-400 hover:underline text-sm"
          >
            Voir toutes mes candidatures →
          </RouterLink>
        </div>
      </section>
    </main>

    <ApplicationDetailModal :application="selectedApp" @close="selectedApp = null" />
    <GlobalFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { RouterLink } from 'vue-router';
import GlobalHeader from '@/components/GlobalHeader.vue';
import GlobalFooter from '@/components/GlobalFooter.vue';
import ApplicationDetailModal from '@/components/ApplicationDetailModal.vue';
import { api } from '@/services/api';
import type { DashboardApplication } from '@/types/application';
import type { User } from '@/types/user';

const stats = ref({ jobs: 0, myApplications: 0 });
const recentApps = ref<DashboardApplication[]>([]);
const user = ref<User | null>(null);
const showModal = ref(false);
const selectedApp = ref<DashboardApplication | null>(null);

const formatDate = (str: string) => {
  const d = new Date(str);
  return d.toLocaleDateString('fr-FR');
};

const openModal = (app: DashboardApplication) => {
  selectedApp.value = app;
  showModal.value = true;
};

const sortedApps = computed(() =>
  [...recentApps.value].sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
);

onMounted(async () => {
  try {
    const [jobsRes, myAppsRes, recentRes, userRes] = await Promise.all([
      api.get('/jobs/count'),
      api.get('/applications/count-mine'),
      api.get('/applications/recent-mine?limit=3'),
      api.get('/users/me')
    ]);
    stats.value.jobs = jobsRes.data.total;
    stats.value.myApplications = myAppsRes.data.total;
    recentApps.value = recentRes.data;
    user.value = userRes.data;
  } catch (err) {
    console.error('Erreur chargement dashboard', err);
  }
});
</script>

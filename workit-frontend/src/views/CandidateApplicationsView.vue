<template>
  <div class="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
    <GlobalHeader />

    <main class="max-w-4xl mx-auto px-4 py-12">
      <h2 class="text-2xl font-bold mb-6 text-center">Toutes mes candidatures</h2>

      <ul v-if="applications.length" class="space-y-4">
        <li
          v-for="app in sortedApps"
          :key="app.id"
          @click="openModal(app)"
          class="cursor-pointer p-5 rounded-xl shadow bg-slate-100 dark:bg-slate-800 hover:ring-2 hover:ring-cyan-500 transition flex items-center justify-between gap-4"
        >
          <!-- Left: Job Info -->
          <div class="flex items-center gap-4">
            <!-- Circle initials avatar -->
            <div
              class="bg-cyan-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
            >
              {{
                app.user.profile
                  ? app.user.profile.firstName[0] + app.user.profile.lastName[0]
                  : '??'
              }}
            </div>

            <div>
              <p class="font-semibold text-base">
                {{ app.job?.title || 'Candidature Spontanée' }}
              </p>
              <p class="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                📅 {{ formatDate(app.appliedAt) }}
              </p>
            </div>
          </div>

          <!-- Right: Status -->
          <span
            class="px-3 py-1 text-sm font-medium rounded-full"
            :class="{
              'bg-yellow-100 text-yellow-700': app.status === 'pending',
              'bg-green-100 text-green-700': app.status === 'reviewed',
              'bg-red-100 text-red-700': app.status === 'rejected',
            }"
          >
          {{ app.status === 'pending' ? 'En attente' : app.status === 'reviewed' ? 'Étape suivante' : 'Rejetée' }}
          </span>
        </li>
      </ul>

      <p v-else class="text-center text-sm text-slate-500 dark:text-slate-400">
        Aucune candidature trouvée.
      </p>
    </main>

    <ApplicationDetailModal
      v-if="selected"
      :application="selected"
      @close="selected = null"
    />

    <GlobalFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import GlobalHeader from '@/components/GlobalHeader.vue';
import GlobalFooter from '@/components/GlobalFooter.vue';
import ApplicationDetailModal from '@/components/ApplicationDetailModal.vue';
import { api } from '@/services/api';
import type { DashboardApplication } from '@/types/application';

const applications = ref<DashboardApplication[]>([]);
const selected = ref<DashboardApplication | null>(null);

const formatDate = (str: string) => {
  const d = new Date(str);
  return d.toLocaleDateString('fr-FR');
};

const openModal = (app: DashboardApplication) => {
  selected.value = app;
};

const sortedApps = computed(() =>
  [...applications.value].sort(
    (a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
  )
);

onMounted(async () => {
  try {
    const res = await api.get('/applications/mine');
    applications.value = res.data;
  } catch (err) {
    console.error('Erreur lors du chargement des candidatures', err);
  }
});
</script>

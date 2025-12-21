<template>
  <transition name="fade">
    <div
      v-if="application"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      @click.self="emitClose"
    >
      <div
        class="bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl p-6 w-full max-w-md shadow-lg"
      >
        <h3 class="text-xl font-bold mb-4">Détails de la candidature</h3>

        <div class="space-y-4">
          <!-- Candidate Info with Avatar -->
          <div class="flex items-center gap-4">
            <div
              class="bg-cyan-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
            >
              {{ initials }}
            </div>
            <div>
              <p class="text-sm text-slate-500 flex items-center gap-1">📧 Candidat</p>
              <p class="font-semibold">
                {{
                  application.user?.profile
                    ? `${application.user.profile.firstName} ${application.user.profile.lastName} (${application.user.email})`
                    : application.user?.email || 'Non disponible'
                }}
              </p>
            </div>
          </div>

          <!-- Job Info -->
          <div>
            <p class="text-sm text-slate-500 flex items-center gap-1">🧑‍💼 Offre</p>
            <p class="font-semibold">
              <RouterLink
                v-if="application.job"
                :to="`/jobs/${application.job.id}`"
                class="text-cyan-600 hover:underline"
              >
                {{ application.job.title }}
              </RouterLink>
              <span v-else>Candidature Spontanée</span>
            </p>
          </div>

          <!-- Submission Date -->
          <div>
            <p class="text-sm text-slate-500 flex items-center gap-1">📅 Soumise le</p>
            <p>{{ formatDate(application.appliedAt) }}</p>
          </div>

          <!-- Status -->
          <div>
            <p class="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-2">
              📌 Statut
            </p>
            <StatusBadge :status="application.status" />
          </div>
        </div>

        <div class="mt-6 text-right">
          <button @click="emitClose" class="text-cyan-600 hover:underline font-semibold">
            Fermer
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { DashboardApplication } from '@/types/application'
import { computed } from 'vue'
import StatusBadge from './StatusBadge.vue'

const { application } = defineProps<{
  application: DashboardApplication | null
}>()

const emit = defineEmits(['close'])

const emitClose = () => emit('close')

const formatDate = (str: string) => {
  const d = new Date(str)
  return d.toLocaleDateString('fr-FR')
}

const initials = computed(() => {
  const profile = application?.user?.profile
  if (!profile) return '??'
  const first = profile.firstName?.[0] || ''
  const last = profile.lastName?.[0] || ''
  return (first + last).toUpperCase()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

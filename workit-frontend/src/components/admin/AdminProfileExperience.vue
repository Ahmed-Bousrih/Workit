<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-cyan-700 dark:text-cyan-400">
      Expérience Professionnelle
    </h3>
    <div
      v-for="(exp, index) in experience"
      :key="index"
      class="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg space-y-2"
    >
      <h4 class="text-base font-semibold text-slate-800 dark:text-white">
        {{ exp.position }} chez {{ exp.company }}
      </h4>
      <p class="text-sm text-slate-600 dark:text-slate-300">
        {{ formatDate(exp.startDate) }} -
        {{ exp.isOngoing ? 'En cours' : formatDate(exp.endDate) || 'Présent' }}
      </p>
      <p class="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line">
        {{ exp.description || '—' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WorkExperience } from '@/types/user'

defineProps<{
  experience: WorkExperience[]
}>()

function formatDate(str?: string | null) {
  if (!str) return ''
  const [year, month] = str.split('-')
  return `${month}/${year}`
}
</script>

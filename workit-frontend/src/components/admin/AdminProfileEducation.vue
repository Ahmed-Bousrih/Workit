<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-cyan-700 dark:text-cyan-400">Éducation</h3>
    <div
      v-for="(edu, index) in education"
      :key="index"
      class="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg space-y-2"
    >
      <h4 class="text-base font-semibold text-slate-800 dark:text-white">
        {{ edu.degree }} à {{ edu.institution }}
      </h4>
      <p class="text-sm text-slate-600 dark:text-slate-300">
        Domaine : {{ edu.fieldOfStudy || '—' }}<br />
        De {{ edu.startYear }} à
        {{ edu.isOngoing ? 'En cours' : edu.endYear || 'Présent' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Education } from '@/types/user';

defineProps<{
  education: Education[];
}>();
</script>

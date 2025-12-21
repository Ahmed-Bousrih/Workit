<template>
  <section class="space-y-2">
    <h3 class="text-lg font-semibold text-cyan-700 dark:text-cyan-400">À propos de moi</h3>

    <div
      class="max-h-48 overflow-y-auto bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-600"
    >
      <p class="text-slate-700 dark:text-slate-300 whitespace-pre-line">
        {{ aboutMe || '—' }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  aboutMe: string
}>()
</script>

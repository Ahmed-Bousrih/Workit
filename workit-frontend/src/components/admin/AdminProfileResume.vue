<template>
  <section class="space-y-4">
    <h3 class="text-lg font-semibold text-cyan-700 dark:text-cyan-400">
      Mon CV
    </h3>

    <div v-if="resumeUrl" class="flex flex-col items-center gap-3 py-4">
      <svg
        class="w-16 h-16 text-red-600"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          d="M4 2a2 2 0 00-2 2v12c0 1.1.9 2 2 2h6v-2H4V4h5v4h4v2h2V8l-4-4H4z"
        />
        <path
          d="M14 13h1v1h-1v-1zM14 15h1v1h-1v-1zM16 13h1v1h-1v-1zM16 15h1v1h-1v-1z"
        />
      </svg>
      <div class="flex gap-6">
        <a
          :href="resumeUrl"
          target="_blank"
          class="text-sm text-cyan-600 hover:underline flex items-center gap-1"
          >👁️ Voir</a
        >
        <a
          :href="resumeUrl"
          download
          class="text-sm text-cyan-600 hover:underline flex items-center gap-1"
          >⬇️ Télécharger</a
        >
      </div>
    </div>

    <p v-else class="text-sm text-slate-500 italic pl-1">
      Aucun CV n'a encore été ajouté.
    </p>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  resumeUrl: string | null
}>()
</script>

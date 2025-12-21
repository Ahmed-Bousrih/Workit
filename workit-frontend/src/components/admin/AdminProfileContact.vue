<template>
  <section class="space-y-5">
    <h3 class="text-lg font-semibold text-cyan-700 dark:text-cyan-400">
      Coordonnées
    </h3>

    <div class="flex items-center gap-3 text-slate-700 dark:text-slate-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5 text-cyan-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M16 12h2a2 2 0 012 2v6H4v-6a2 2 0 012-2h2m4 0v6m-4-6v6m8-6v6m4-10H4a2 2 0 00-2 2v2h20v-2a2 2 0 00-2-2z"
        />
      </svg>
      <span class="truncate">{{ email }}</span>
    </div>

    <div class="flex items-center gap-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5 text-cyan-600"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          d="M2 3a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-.293.707l-.707.707a1 1 0 000 1.414l1.586 1.586a1 1 0 001.414 0l.707-.707a1 1 0 01.707-.293H13a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 00-.707.293l-.707.707a1 1 0 000 1.414l1.586 1.586a1 1 0 001.414 0l.707-.707A1 1 0 0116 15v-2a1 1 0 011-1h2a1 1 0 011 1v2a3 3 0 01-3 3H5a3 3 0 01-3-3V5a3 3 0 013-3h2a1 1 0 110 2H5a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1v-1.586l-4.707 4.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l4.707-4.707A1 1 0 0112 6h1a1 1 0 100-2h-1a3 3 0 00-2.121.879L5.707 9.05a3 3 0 000 4.242l5 5a3 3 0 004.242 0L20 13.414V17a1 1 0 01-1 1H5a1 1 0 01-1-1V5z"
        />
      </svg>
      <span class="text-slate-700 dark:text-slate-200">{{ phone || '—' }}</span>
    </div>

    <div class="flex items-center gap-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5 text-cyan-600"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M5.05 4.05a7 7 0 019.9 0 7 7 0 010 9.9l-4.243 4.243a1 1 0 01-1.414 0L5.05 13.95a7 7 0 010-9.9zM10 12a2 2 0 100-4 2 2 0 000 4z"
          clip-rule="evenodd"
        />
      </svg>
      <span class="text-slate-700 dark:text-slate-200">{{
        address || '—'
      }}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  email: string
  phone: string
  address: string
}>()
</script>

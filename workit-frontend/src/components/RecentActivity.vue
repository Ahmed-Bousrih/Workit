<template>
  <section>
    <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
      🕒 Dernières candidatures
    </h3>
    <ul class="space-y-2">
      <li
        v-for="app in items"
        :key="app.id"
        class="bg-slate-200 dark:bg-slate-800 p-4 rounded-lg shadow-sm text-sm text-slate-800 dark:text-slate-100"
      >
        📩
        <strong>
          {{ app.user.profile?.firstName }} {{ app.user.profile?.lastName }}
          <small class="text-slate-500 dark:text-slate-400">({{ app.user.email }})</small>
        </strong>
        <span v-if="app.job"
          >a postulé à <strong>{{ app.job.title }}</strong></span
        >
        <span v-else>a soumis une candidature spontanée</span>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  items: {
    id: string
    user: {
      email: string
      profile?: {
        firstName: string
        lastName: string
      }
    }
    job: { title: string } | null
  }[]
}>()
</script>

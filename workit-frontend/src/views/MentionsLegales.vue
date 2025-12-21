<template>
  <div
    class="min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
  >
    <GlobalHeader />

    <main class="flex-grow max-w-5xl mx-auto px-4 py-16 text-center">
      <h2 class="text-4xl font-bold mb-6">Mentions Légales</h2>

      <p class="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
        Ce site est la propriété exclusive de MedTrust. Il est destiné à la gestion du recrutement
        interne. Tous les contenus présents sur cette plateforme sont protégés par les lois en
        vigueur sur la propriété intellectuelle.
      </p>

      <p class="text-sm text-slate-500 dark:text-slate-400">
        Pour toute réclamation ou question juridique, veuillez nous contacter via notre formulaire.
      </p>
    </main>

    <GlobalFooter />
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalFooter from '@/components/GlobalFooter.vue'
</script>

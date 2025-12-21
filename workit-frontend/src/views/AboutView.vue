<template>
  <div
    class="min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
  >
    <GlobalHeader />

    <main class="flex-grow max-w-5xl mx-auto px-4 py-16 text-center">
      <h2 class="text-4xl font-bold mb-6">À propos de WorkIt</h2>

      <p class="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
        WorkIt est une plateforme intelligente de recrutement conçue pour connecter les talents avec
        les meilleures opportunités professionnelles. Notre mission est de simplifier le processus
        de recherche d'emploi et de recrutement grâce à une technologie moderne et accessible.
        Rejoignez-nous pour trouver votre prochain défi professionnel ou votre prochain
        collaborateur !
      </p>
    </main>

    <GlobalFooter />
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalFooter from '@/components/GlobalFooter.vue'
</script>

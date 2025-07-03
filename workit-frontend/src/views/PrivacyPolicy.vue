<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
    <GlobalHeader />

    <main class="flex-grow max-w-5xl mx-auto px-4 py-16 text-center">
      <h2 class="text-4xl font-bold mb-6">Politique de Confidentialité</h2>

      <p class="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
        Nous attachons une grande importance à la protection de vos données personnelles.
        Vos informations sont utilisées uniquement pour le traitement de vos candidatures, la création de votre profil, et le contact éventuel par nos partenaires employeurs.
        Conformément au RGPD, vous pouvez à tout moment demander la modification ou la suppression de vos données personnelles en nous contactant via notre formulaire dédié.
      </p>

      <p class="text-sm text-slate-500 dark:text-slate-400">
        Pour toute question relative à la confidentialité de vos données, merci de nous contacter.
      </p>
    </main>

    <GlobalFooter />
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalFooter from '@/components/GlobalFooter.vue'
</script>

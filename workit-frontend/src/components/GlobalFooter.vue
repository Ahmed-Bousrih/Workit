<template>
  <footer class="bg-slate-900 dark:bg-slate-800 text-white py-10 mt-16">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
      <div>
        <h3 class="font-bold text-cyan-400 dark:text-cyan-300 mb-2">À propos</h3>
        <ul class="space-y-1 text-sm text-slate-300 dark:text-slate-400">
          <li>
            <RouterLink to="/about" class="hover:text-cyan-500 dark:hover:text-cyan-400 transition">
              Notre mission
            </RouterLink>
          </li>
          <li>
            <a href="#" class="hover:text-cyan-500 dark:hover:text-cyan-400 transition"> Équipe </a>
          </li>
        </ul>
      </div>

      <div>
        <h3 class="font-bold text-cyan-400 dark:text-cyan-300 mb-2">Support</h3>
        <ul class="space-y-1 text-sm text-slate-300 dark:text-slate-400">
          <li>
            <a href="#" class="hover:text-cyan-500 dark:hover:text-cyan-400 transition"> FAQ </a>
          </li>
          <li>
            <a href="#" class="hover:text-cyan-500 dark:hover:text-cyan-400 transition">
              Contact
            </a>
          </li>
        </ul>
      </div>

      <div>
        <h3 class="font-bold text-cyan-400 dark:text-cyan-300 mb-2">Légal</h3>
        <ul class="space-y-1 text-sm text-slate-300 dark:text-slate-400">
          <li>
            <RouterLink
              to="/privacy-policy"
              class="hover:text-cyan-500 dark:hover:text-cyan-400 transition"
            >
              Politique de confidentialité
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/mentions-legales"
              class="hover:text-cyan-500 dark:hover:text-cyan-400 transition"
            >
              Mentions légales
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
    <div class="text-center text-xs text-slate-400 dark:text-slate-500 mt-10">
      © 2025 WorkIt. Tous droits réservés.
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

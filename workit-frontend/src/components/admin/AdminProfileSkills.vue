<template>
  <section>
    <h3 class="text-lg font-semibold text-cyan-700 dark:text-cyan-400 mb-2">Compétences</h3>
    <div class="flex flex-wrap gap-2">
      <template v-for="(skill, index) in visibleSkills" :key="index">
        <div
          class="px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-700 text-cyan-800 dark:text-white text-sm"
        >
          {{ skill.name }}
        </div>
      </template>

      <button
        v-if="skills.length > 10"
        @click="showAllModal = true"
        class="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm hover:bg-slate-300 dark:hover:bg-slate-500"
      >
        +{{ skills.length - 10 }} autres... Voir tout
      </button>
    </div>

    <div
      v-if="showAllModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-slate-800 p-6 rounded-lg max-w-md w-full shadow-lg space-y-4">
        <h4 class="text-lg font-semibold text-cyan-700 dark:text-cyan-400">
          Toutes les compétences
        </h4>

        <div class="flex flex-wrap gap-2">
          <template v-for="(skill, index) in skills" :key="index">
            <div
              class="px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-700 text-cyan-800 dark:text-white text-sm"
            >
              {{ skill.name }}
            </div>
          </template>
        </div>

        <div class="text-right pt-4">
          <button @click="showAllModal = false" class="text-sm text-cyan-600 hover:underline">
            Fermer
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Skill } from '@/types/user'

const props = defineProps<{
  skills: Skill[]
}>()

const showAllModal = ref(false)
const visibleSkills = computed(() => props.skills.slice(0, 10))
</script>

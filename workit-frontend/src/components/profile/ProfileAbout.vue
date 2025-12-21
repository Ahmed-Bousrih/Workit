<template>
  <section class="space-y-2">
    <h3 class="text-lg font-semibold text-cyan-700 dark:text-cyan-400">À propos de moi</h3>

    <!-- Editable textarea -->
    <textarea
      v-if="isEditing"
      v-model="localAboutMe"
      placeholder="Décrivez-vous ici..."
      rows="5"
      class="w-full px-3 py-2 border rounded-lg resize-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
    />

    <!-- Static view -->
    <p
      v-else
      class="text-slate-700 dark:text-slate-300 whitespace-pre-line overflow-y-auto"
      style="max-height: 12rem"
    >
      {{ aboutMe || '—' }}
    </p>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  aboutMe: string
  isEditing: boolean
}>()

const emit = defineEmits<{
  (e: 'update:aboutMe', value: string): void
}>()

const localAboutMe = computed({
  get: () => props.aboutMe,
  set: (value: string) => emit('update:aboutMe', value),
})
</script>

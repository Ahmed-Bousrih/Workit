<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
  >
    <div
      class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg max-w-sm w-full text-center text-slate-800 dark:text-slate-100"
    >
      <h2 class="text-lg font-bold text-red-700 dark:text-red-400 mb-4">
        Confirmer la suppression
      </h2>
      <p class="text-slate-600 dark:text-slate-400 mb-6">
        Êtes-vous sûr de vouloir supprimer cette offre ?
      </p>
      <div class="flex justify-center gap-4">
        <button
          class="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded transition"
          @click="$emit('cancel')"
        >
          Annuler
        </button>
        <button
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
          @click="$emit('confirm')"
        >
          Supprimer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ visible: boolean }>()
defineEmits(['confirm', 'cancel'])
</script>

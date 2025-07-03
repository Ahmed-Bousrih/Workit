<template>
  <section class="space-y-4">
    <h3 class="text-lg font-semibold text-cyan-700 dark:text-cyan-400">Mon CV</h3>

    <!-- Resume display with large icon -->
    <div v-if="resumeUrl" class="flex flex-col items-center gap-3 py-4">
      <!-- Big PDF Icon -->
      <svg class="w-16 h-16 text-red-600" fill="currentColor" viewBox="0 0 20 20">
        <path d="M4 2a2 2 0 00-2 2v12c0 1.1.9 2 2 2h6v-2H4V4h5v4h4v2h2V8l-4-4H4z"/>
        <path d="M14 13h1v1h-1v-1zM14 15h1v1h-1v-1zM16 13h1v1h-1v-1zM16 15h1v1h-1v-1z"/>
      </svg>

      <div class="flex gap-6">
        <a
          :href="resumeUrl"
          target="_blank"
          class="text-sm text-cyan-600 hover:underline flex items-center gap-1"
        >
          👁️ Voir
        </a>
        <a
          :href="resumeUrl"
          download
          class="text-sm text-cyan-600 hover:underline flex items-center gap-1"
        >
          ⬇️ Télécharger
        </a>
      </div>
    </div>

    <!-- Upload input in edit mode -->
    <div v-if="isEditing" class="pt-2 space-y-2 text-center">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ resumeUrl ? 'Remplacer le fichier existant' : 'Télécharger votre CV' }}
      </label>
      <input
        type="file"
        accept=".pdf"
        @change="handleUpload"
        class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
      />
      <button
        v-if="resumeUrl"
        @click="emit('remove-resume')"
        class="text-sm text-red-600 hover:underline flex items-center gap-1 justify-center mx-auto"
      >
        🗑️ Supprimer le CV
      </button>
    </div>

    <!-- Empty state -->
    <p v-if="!resumeUrl && !isEditing" class="text-sm text-slate-500 italic pl-1">
      Aucun CV n'a encore été ajouté.
    </p>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  resumeUrl: string | null;
  isEditing?: boolean;
}>();

const emit = defineEmits<{
  (e: 'upload-resume', file: File): void;
  (e: 'remove-resume'): void;
}>();

function handleUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) emit('upload-resume', file);
}
</script>

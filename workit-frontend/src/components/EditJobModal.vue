<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
    >
      <div
        class="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-6 rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <h2 class="text-xl font-bold text-cyan-700 dark:text-cyan-400 mb-4">
          Modifier l'offre
        </h2>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label
              class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >Titre du poste</label
            >
            <input
              v-model="form.title"
              type="text"
              class="input-style"
              required
            />
          </div>

          <div>
            <label
              class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >Localisation (optionnel)</label
            >
            <input v-model="form.location" type="text" class="input-style" />
          </div>

          <div>
            <label
              class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >Présentation générale</label
            >
            <textarea
              v-model="form.descriptionGeneral"
              rows="3"
              class="input-style"
            />
          </div>

          <div>
            <label
              class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >Missions principales</label
            >
            <textarea v-model="form.missions" rows="4" class="input-style" />
          </div>

          <div>
            <label
              class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >Profil recherché</label
            >
            <textarea v-model="form.profile" rows="4" class="input-style" />
          </div>

          <div>
            <label
              class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >Avantages (optionnel)</label
            >
            <textarea v-model="form.advantages" rows="3" class="input-style" />
          </div>

          <div class="flex justify-between pt-4">
            <button
              type="button"
              class="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded transition"
              @click="$emit('cancel')"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded transition"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Job } from '@/types/job'
import { api } from '@/services/api'
import { useToast } from 'vue-toastification'
import type { CreateJobDto } from '@/types/create-job.dto'

const props = defineProps<{
  visible: boolean
  job: Job | null
}>()

const emit = defineEmits(['updated', 'cancel'])

const toast = useToast()

const form = reactive({
  title: '',
  location: '',
  descriptionGeneral: '',
  missions: '',
  profile: '',
  advantages: '',
})

// Watch incoming job and fill form
watch(
  () => props.job,
  (job) => {
    if (job) {
      form.title = job.title
      form.location = job.location || ''
      form.descriptionGeneral = job.descriptionGeneral || ''
      form.missions = job.missions || ''
      form.profile = job.profile || ''
      form.advantages = job.advantages || ''
    }
  },
  { immediate: true },
)

const handleSubmit = async () => {
  if (!props.job) return
  try {
    const payload: Partial<CreateJobDto> = {}

    if (form.title) payload.title = form.title
    if (form.location) payload.location = form.location
    if (form.descriptionGeneral)
      payload.descriptionGeneral = form.descriptionGeneral
    if (form.missions) payload.missions = form.missions
    if (form.profile) payload.profile = form.profile
    if (form.advantages) payload.advantages = form.advantages

    await api.patch(`/jobs/${props.job.id}`, payload)
    toast.success('✅ Offre modifiée avec succès', {
      timeout: 3000,
      icon: '✏️',
    })
    emit('updated')
  } catch (err) {
    console.error(err)
    toast.error('Erreur lors de la mise à jour')
  }
}
</script>

<style scoped>
.input-style {
  width: 100%;
  border: 1px solid var(--tw-border-opacity, 1) gray-300;
  background-color: white;
  color: #1f2937;
  padding: 0.5rem 1rem;
  margin-top: 0.25rem;
  border-radius: 0.375rem;
  outline: none;
}
.dark .input-style {
  background-color: #374151;
  border-color: #4b5563;
  color: #e5e7eb;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

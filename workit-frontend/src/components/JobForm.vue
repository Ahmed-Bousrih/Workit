<template>
  <form
    @submit.prevent="handleSubmit"
    class="space-y-4 p-6 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl shadow max-w-xl mx-auto transition"
  >
    <h2 class="text-xl font-bold text-cyan-700 dark:text-cyan-400">
      Nouvelle Offre d'emploi
    </h2>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >Titre du poste</label
      >
      <input
        v-model="form.title"
        type="text"
        required
        placeholder="Titre de l'offre"
        class="input-style"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >Lieu (optionnel)</label
      >
      <input
        v-model="form.location"
        type="text"
        placeholder="Lieu du Travail"
        class="input-style"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >Présentation générale</label
      >
      <textarea
        v-model="form.descriptionGeneral"
        placeholder="Présentation rapide"
        class="input-style"
        rows="3"
      ></textarea>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >Missions</label
      >
      <textarea
        v-model="form.missions"
        placeholder="Missions principales"
        class="input-style"
        rows="5"
      ></textarea>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >Profil recherché</label
      >
      <textarea
        v-model="form.profile"
        placeholder="Profil du candidat"
        class="input-style"
        rows="5"
      ></textarea>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >Avantages (optionnel)</label
      >
      <textarea
        v-model="form.advantages"
        placeholder="Avantages du poste"
        class="input-style"
        rows="4"
      ></textarea>
    </div>

    <div class="text-right">
      <button
        type="submit"
        class="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded transition"
      >
        Publier
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { api } from '@/services/api'
import { useToast } from 'vue-toastification'

const emit = defineEmits(['jobCreated'])
const toast = useToast()

const form = ref({
  title: '',
  location: '',
  descriptionGeneral: '',
  missions: '',
  profile: '',
  advantages: '',
})

const handleSubmit = async () => {
  try {
    await api.post('/jobs', {
      title: form.value.title,
      location: form.value.location,
      descriptionGeneral: form.value.descriptionGeneral,
      missions: form.value.missions,
      profile: form.value.profile,
      advantages: form.value.advantages,
    })
    toast.success('Offre créée avec succès ✅')
    emit('jobCreated')
    form.value = {
      title: '',
      location: '',
      descriptionGeneral: '',
      missions: '',
      profile: '',
      advantages: '',
    }
  } catch (err) {
    toast.error("Erreur lors de l'enregistrement de l'offre ❌")
    console.error(err)
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
</style>

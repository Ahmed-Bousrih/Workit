<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-semibold text-cyan-700 dark:text-cyan-400">
        Expérience Professionnelle
      </h3>
      <button v-if="isEditing" @click="addExperience" class="text-sm text-cyan-600 hover:underline">
        Ajouter une expérience
      </button>
    </div>

    <div
      v-for="(exp, index) in experience"
      :key="index"
      class="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg space-y-4"
    >
      <h4 class="text-base font-semibold text-slate-800 dark:text-white mb-2">
        Expérience {{ index + 1 }}
      </h4>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Entreprise</label>
          <input
            v-model="exp.company"
            :readonly="!isEditing"
            class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Poste</label>
          <input
            v-model="exp.position"
            :readonly="!isEditing"
            class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Date de début</label>
          <input
            v-model="exp.startDate"
            type="month"
            :readonly="!isEditing"
            class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
        </div>

        <!-- Date de fin -->
        <div>
          <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Date de fin</label>
          <div class="space-y-1">
            <!-- When not editing and ongoing, show 'En cours' -->
            <input
              v-if="!isEditing && exp.isOngoing"
              type="text"
              value="En cours"
              readonly
              disabled
              class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white disabled:opacity-60"
            />

            <!-- Editable or viewable field -->
            <input
              v-else
              v-model="exp.endDate"
              type="month"
              :readonly="!isEditing || exp.isOngoing"
              :disabled="exp.isOngoing"
              placeholder="Date de fin"
              class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white disabled:opacity-60"
            />

            <!-- Checkbox only in edit mode -->
            <div v-if="isEditing" class="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                v-model="exp.isOngoing"
                class="form-checkbox rounded border-gray-400 dark:border-slate-600"
              />
              <label class="text-sm text-gray-600 dark:text-gray-300">
                Je travaille encore ici
              </label>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Description</label>
        <textarea
          v-model="exp.description"
          :readonly="!isEditing"
          class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          rows="3"
        ></textarea>
      </div>

      <div v-if="isEditing" class="text-right">
        <button @click="removeExperience(index)" class="text-sm text-red-500 hover:underline">
          Supprimer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { WorkExperience } from '@/types/user'

const props = defineProps<{
  experience: WorkExperience[]
  isEditing: boolean
}>()

const emit = defineEmits<{
  (e: 'update:experience', value: WorkExperience[]): void
}>()

const addExperience = () => {
  const now = new Date()
  const formatted = now.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit' }) // "YYYY-MM"

  const updated = [
    ...props.experience,
    {
      company: '',
      position: '',
      startDate: formatted, // ✅ proper month value
      endDate: null,
      isOngoing: false,
      description: '',
    },
  ]
  emit('update:experience', updated)
}
const removeExperience = (index: number) => {
  const updated = props.experience.filter((_, i) => i !== index)
  emit('update:experience', updated)
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-semibold text-cyan-700 dark:text-cyan-400">Éducation</h3>
      <button
        v-if="isEditing"
        @click="addEducation"
        class="text-sm text-cyan-600 hover:underline"
      >
        Ajouter une formation
      </button>
    </div>

    <div
      v-for="(edu, index) in localEducation"
      :key="index"
      class="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg space-y-4"
    >
      <h4 class="text-base font-semibold text-slate-800 dark:text-white mb-2">
        Formation {{ index + 1 }}
      </h4>
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Établissement</label>
          <input
            v-model="edu.institution"
            :readonly="!isEditing"
            class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Diplôme</label>
          <input
            v-model="edu.degree"
            :readonly="!isEditing"
            class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Domaine d'étude</label>
        <input
          v-model="edu.fieldOfStudy"
          :readonly="!isEditing"
          class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Année de début</label>
          <input
            v-model="edu.startYear"
            type="number"
            :readonly="!isEditing"
            class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Année de fin</label>
          <input
            v-model="edu.endYear"
            type="number"
            :disabled="edu.isOngoing"
            :readonly="!isEditing"
            placeholder="Année de fin"
            class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white disabled:opacity-60"
          />

          <!-- Checkbox only when editing -->
          <div v-if="isEditing" class="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              v-model="edu.isOngoing"
              class="form-checkbox rounded border-gray-400 dark:border-slate-600"
            />
            <label class="text-sm text-gray-600 dark:text-gray-300">
              Je suis encore en formation
            </label>
          </div>
        </div>
      </div>

      <div v-if="isEditing" class="text-right">
        <button
          @click="removeEducation(index)"
          class="text-sm text-red-500 hover:underline"
        >
          Supprimer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Education } from '@/types/user';

const props = defineProps<{
  education: Education[];
  isEditing: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:education', value: Education[]): void;
}>();

// ✅ Create reactive local copy
const localEducation = ref<Education[]>([...props.education]);

watch(() => props.education, (val) => {
  localEducation.value = [...val];
}, { deep: true, immediate: true });

watch(localEducation, (val) => {
  emit('update:education', val);
}, { deep: true });

const addEducation = () => {
  localEducation.value.push({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startYear: new Date().getFullYear(),
    endYear: undefined,
    isOngoing: false,
  });
};

const removeEducation = (index: number) => {
  localEducation.value.splice(index, 1);
};
</script>

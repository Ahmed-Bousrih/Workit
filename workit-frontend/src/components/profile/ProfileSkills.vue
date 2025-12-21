<template>
  <div class="space-y-4">
    <!-- Header -->
    <h3 class="text-lg font-semibold text-cyan-700 dark:text-cyan-400 mb-2 text-center">
      Compétences
    </h3>

    <!-- Input Field (Edit Mode Only) -->
    <div v-if="isEditing" class="flex justify-center mb-4">
      <div class="relative w-full sm:w-80">
        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl">➕</span>
        <input
          v-model="newSkill"
          @keyup.enter="addSkill"
          placeholder="Ajouter une compétence…"
          class="pl-9 pr-3 py-2 w-full border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>
    </div>

    <!-- Skill tags -->
    <div class="flex flex-wrap gap-2">
      <template v-for="(skill, index) in visibleSkills" :key="index">
        <div
          class="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-700 text-cyan-800 dark:text-white text-sm"
        >
          <span class="truncate">{{ skill.name }}</span>
          <button
            v-if="isEditing"
            @click="removeSkill(index)"
            class="text-xs text-red-500 hover:text-red-700 focus:outline-none"
            aria-label="Supprimer"
          >
            ✕
          </button>
        </div>
      </template>

      <!-- Overflow indicator -->
      <button
        v-if="skills.length > 10"
        @click="showAllModal = true"
        class="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm hover:bg-slate-300 dark:hover:bg-slate-500"
      >
        +{{ skills.length - 10 }} autres... Voir tout
      </button>

      <!-- Modal -->
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
                class="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-700 text-cyan-800 dark:text-white text-sm"
              >
                <span class="truncate">{{ skill.name }}</span>
                <button
                  v-if="isEditing"
                  @click="removeSkill(index)"
                  class="text-xs text-red-500 hover:text-red-700"
                  aria-label="Supprimer"
                >
                  ✕
                </button>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed } from 'vue'

interface Skill {
  id?: string
  name: string
}

const props = defineProps<{
  skills: Skill[]
  isEditing: boolean
}>()

const emit = defineEmits<{
  (e: 'update:skills', value: Skill[]): void
}>()

const newSkill = ref('')
const showAllModal = ref(false)
const visibleSkills = computed(() => props.skills.slice(0, 10))

const addSkill = () => {
  const name = newSkill.value.trim()
  if (name && !props.skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
    emit('update:skills', [...props.skills, { name }])
    newSkill.value = ''
  }
}

const removeSkill = (index: number) => {
  const updated = props.skills.filter((_, i) => i !== index)
  emit('update:skills', updated)
}
</script>

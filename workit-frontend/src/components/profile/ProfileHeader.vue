<template>
  <section class="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl shadow-md">
    <div class="flex items-center justify-between gap-6 flex-wrap">
      <!-- Avatar + Info -->
      <div class="flex items-center gap-4 flex-grow min-w-0">
        <!-- Avatar -->
        <div class="relative w-28 h-28 rounded-full overflow-hidden flex items-center justify-center text-3xl font-bold text-white bg-cyan-600 shrink-0">
          <img
            v-if="profilePicture"
            :src="profilePicture"
            :key="profilePicture"
            alt="Avatar"
            class="object-cover w-full h-full"
          />
          <span v-else>{{ initials }}</span>
          <input
            v-if="isEditing"
            type="file"
            accept="image/*"
            @change="$emit('upload-photo', $event)"
            class="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        <!-- Name and Email -->
        <div class="truncate">
          <!-- Editable name -->
          <div v-if="isEditing" class="flex gap-2 flex-wrap items-start mb-1">
            <input
              v-model="editableProfile.firstName"
              @input="emitUpdate"
              type="text"
              placeholder="Prénom"
              class="px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white w-32 sm:w-40"
            />
            <input
              v-model="editableProfile.lastName"
              @input="emitUpdate"
              type="text"
              placeholder="Nom"
              class="px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white w-32 sm:w-40"
            />
          </div>

          <!-- Static name -->
          <h2 v-else class="text-2xl font-bold truncate">
            {{ profile.firstName || 'Prénom' }} {{ profile.lastName || 'Nom' }}
          </h2>

          <!-- Email (always visible) -->
          <p class="text-sm text-slate-600 dark:text-slate-300 truncate">
            {{ email }}
          </p>
        </div>
      </div>

      <!-- Edit / Cancel Button -->
      <div class="shrink-0">
        <button
          v-if="!isEditing"
          @click="$emit('toggle-edit')"
          class="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg"
        >
          Modifier
        </button>
        <button
          v-else
          @click="handleCancel"
          class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          Annuler
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  profile: { firstName: string; lastName: string };
  email: string;
  profilePicture: string | null;
  isEditing: boolean;
}>();
const router = useRouter();

const emit = defineEmits<{
  (e: 'update:profile', value: { firstName: string; lastName: string }): void;
  (e: 'upload-photo', event: Event): void;
  (e: 'toggle-edit'): void;
}>();

const editableProfile = ref({ ...props.profile });

const emitUpdate = () => {
  emit('update:profile', { ...editableProfile.value });
};

watch(
  () => props.profile,
  (newProfile) => {
    editableProfile.value = { ...newProfile };
  },
  { immediate: true }
);

// fallback initials
const initials = computed(() => {
  const f = props.profile.firstName?.[0] || '';
  const l = props.profile.lastName?.[0] || '';
  return `${f}${l}`.toUpperCase();
});

const handleCancel = () => {
  emit('toggle-edit');
  setTimeout(() => {
    router.go(0);
  }, 500);
};
</script>

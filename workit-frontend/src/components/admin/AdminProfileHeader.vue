<template>
  <section class="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl shadow-md">
    <div class="flex items-center gap-6 flex-wrap">
      <div class="relative w-28 h-28 rounded-full overflow-hidden flex items-center justify-center text-3xl font-bold text-white bg-cyan-600 shrink-0">
        <img v-if="profilePicture" :src="profilePicture" alt="Avatar" class="object-cover w-full h-full" />
        <span v-else>{{ initials }}</span>
      </div>
      <div class="truncate">
        <h2 class="text-2xl font-bold truncate">
          {{ profile.firstName || 'Prénom' }} {{ profile.lastName || 'Nom' }}
        </h2>
        <p class="text-sm text-slate-600 dark:text-slate-300 truncate">
          {{ email }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  profile: { firstName: string; lastName: string };
  email: string;
  profilePicture: string | null;
}>();

const initials = computed(() => {
  const f = props.profile.firstName?.[0] || '';
  const l = props.profile.lastName?.[0] || '';
  return `${f}${l}`.toUpperCase();
});
</script>

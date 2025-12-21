<template>
  <router-link
    :to="to"
    class="text-white py-4 px-4 rounded-xl shadow text-center text-base font-semibold transition flex items-center justify-center gap-2"
    :class="[color, hoverColor]"
  >
    <span class="text-2xl">{{ icon }}</span>
    {{ label }}
  </router-link>
</template>

<script setup lang="ts">
defineProps<{
  to: string
  label: string
  icon: string
  color?: string
  hoverColor?: string
}>()
</script>

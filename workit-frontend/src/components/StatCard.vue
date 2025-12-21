<template>
  <div
    class="bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-lg transition-all duration-300 px-6 py-5 border-l-4"
    :class="color"
  >
    <div class="flex flex-col items-center text-center space-y-1">
      <!-- Icon on top -->
      <div v-if="icon" class="text-4xl mb-2">
        {{ icon }}
      </div>

      <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">
        {{ label }}
      </p>
      <p class="text-3xl font-bold" :class="textColor">
        {{ animatedValue }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watch, onMounted } from 'vue'

const props = defineProps<{
  label: string
  value: number
  icon?: string
  color?: string
  textColor?: string
}>()

const animatedValue = ref(0)

onMounted(() => {
  animateToValue(props.value)
})

watch(
  () => props.value,
  (newVal) => {
    animateToValue(newVal)
  },
)

function animateToValue(target: number) {
  const duration = 800
  const steps = 30
  const increment = target / steps
  let current = 0

  const interval = setInterval(() => {
    current += increment
    if (current >= target) {
      animatedValue.value = target
      clearInterval(interval)
    } else {
      animatedValue.value = Math.floor(current)
    }
  }, duration / steps)
}
</script>

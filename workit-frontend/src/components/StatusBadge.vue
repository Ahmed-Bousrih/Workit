<template>
  <span
    class="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full transition-colors"
    :class="statusClasses"
  >
    <span v-if="showIcon" class="text-base">{{ statusIcon }}</span>
    <span>{{ statusLabel }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ApplicationStatus, ApplicationStatusLabels, ApplicationStatusColors } from '@/types/enums'

const props = withDefaults(
  defineProps<{
    status: ApplicationStatus
    showIcon?: boolean
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    showIcon: true,
    size: 'md',
  },
)

const statusLabel = computed(() => ApplicationStatusLabels[props.status])
const statusColors = computed(() => ApplicationStatusColors[props.status])

const statusIcon = computed(() => {
  switch (props.status) {
    case ApplicationStatus.PENDING:
      return '⏳'
    case ApplicationStatus.REVIEWED:
      return '👀'
    case ApplicationStatus.ACCEPTED:
      return '✅'
    case ApplicationStatus.REJECTED:
      return '❌'
    default:
      return '📋'
  }
})

const statusClasses = computed(() => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  }

  return `${statusColors.value.bg} ${statusColors.value.text} ${sizeClasses[props.size]}`
})
</script>

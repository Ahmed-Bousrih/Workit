<template>
  <div class="w-full flex justify-center">
    <div class="w-full max-w-4xl h-[300px]">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'
import { computed } from 'vue'

// Register Chart.js modules
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

// Props
const props = defineProps<{
  data: {
    title: string
    applications: number
  }[]
}>()

// Detect Dark Mode
const isDark = computed(() => document.documentElement.classList.contains('dark'))

// Chart Data
const chartData = computed(() => ({
  labels: props.data.map((job) => job.title),
  datasets: [
    {
      label: 'Nombre de candidatures',
      data: props.data.map((job) => job.applications),
      backgroundColor: isDark.value ? '#38bdf8' : '#0ea5e9', // Lighter cyan for dark mode
    },
  ],
}))

// Chart Options
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: {
        color: isDark.value ? '#e2e8f0' : '#334155', // light gray or dark gray
      },
      grid: {
        color: isDark.value ? '#334155' : '#cbd5e1', // darker/lighter grid
      },
    },
    y: {
      ticks: {
        color: isDark.value ? '#e2e8f0' : '#334155',
      },
      grid: {
        color: isDark.value ? '#334155' : '#cbd5e1',
      },
    },
  },
  plugins: {
    legend: {
      labels: {
        color: isDark.value ? '#e2e8f0' : '#334155',
      },
    },
  },
}))
</script>

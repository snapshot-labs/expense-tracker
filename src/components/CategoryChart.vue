<script setup>
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { useTransactions } from '../composables/useTransactions'

ChartJS.register(ArcElement, Tooltip, Legend)

const { categoryData } = useTransactions()

const colors = [
  '#0052ff', // blue
  '#00d395', // green
  '#ff5c00', // orange
  '#9b59b6', // purple
  '#e91e63', // pink
  '#00bcd4', // cyan
  '#ffc107', // amber
  '#8bc34a', // light green
  '#ff6b6b', // coral
  '#3f51b5', // indigo
  '#795548', // brown
]

const chartData = computed(() => ({
  labels: categoryData.value.labels,
  datasets: [
    {
      data: categoryData.value.values,
      backgroundColor: colors.slice(0, categoryData.value.labels.length),
      borderWidth: 0,
      hoverOffset: 2,
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  cutout: '65%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 12,
        usePointStyle: true,
        pointStyle: 'circle',
        font: {
          family: "'DM Sans', sans-serif",
          size: 11,
        },
        color: '#5b616e',
      }
    },
    tooltip: {
      backgroundColor: '#0a0b0d',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      titleFont: {
        family: "'DM Sans', sans-serif",
        size: 12,
        weight: '600',
      },
      bodyFont: {
        family: "'DM Sans', sans-serif",
        size: 12,
      },
      borderWidth: 0,
      padding: 10,
      cornerRadius: 8,
      callbacks: {
        label: (context) => {
          const total = context.dataset.data.reduce((a, b) => a + b, 0)
          const percentage = ((context.parsed / total) * 100).toFixed(1)
          return `$${context.parsed.toLocaleString('en-US', { minimumFractionDigits: 2 })} (${percentage}%)`
        }
      }
    }
  }
}
</script>

<template>
  <div class="p-4 bg-[#f9fafb] rounded-xl">
    <p class="text-xs text-[#8a919e] mb-1">Spending</p>
    <p class="text-sm font-medium text-[#0a0b0d] mb-4">By category</p>
    <div class="h-64">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

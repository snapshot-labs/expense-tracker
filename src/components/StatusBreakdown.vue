<script setup>
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { useTransactions } from '../composables/useTransactions'

ChartJS.register(ArcElement, Tooltip, Legend)

const { statusData } = useTransactions()

const statusColors = {
  'Cleared': '#00d395',
  'Declined': '#cf202f',
  'Voided': '#9ca3af',
  'Refunded': '#0052ff',
  'Pending': '#ffc107',
  'Unknown': '#d1d5db',
}

const chartData = computed(() => ({
  labels: statusData.value.labels,
  datasets: [
    {
      data: statusData.value.values,
      backgroundColor: statusData.value.labels.map(l => statusColors[l] || '#d1d5db'),
      borderWidth: 0,
      hoverOffset: 2,
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
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
          return `${context.parsed} (${percentage}%)`
        }
      }
    }
  }
}
</script>

<template>
  <div class="p-4 bg-[#f9fafb] rounded-xl">
    <p class="text-xs text-[#8a919e] mb-1">Transaction</p>
    <p class="text-sm font-medium text-[#0a0b0d] mb-4">Status</p>
    <div class="h-56">
      <Pie :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

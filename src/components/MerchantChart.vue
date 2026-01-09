<script setup>
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { useTransactions } from '../composables/useTransactions'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const { merchantData, getMerchantColor } = useTransactions()

const chartData = computed(() => ({
  labels: merchantData.value.labels.map(l => l.length > 18 ? l.substring(0, 18) + '...' : l),
  datasets: [
    {
      label: 'Total spent',
      data: merchantData.value.values,
      backgroundColor: merchantData.value.labels.map(m => getMerchantColor(m)),
      borderWidth: 0,
      borderRadius: 4,
      barThickness: 16,
    }
  ]
}))

const chartOptions = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: {
    legend: {
      display: false,
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
        title: (context) => {
          const index = context[0].dataIndex
          return merchantData.value.labels[index]
        },
        label: (context) => {
          return `$${context.parsed.x.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: '#f3f4f6',
        drawBorder: false,
      },
      border: {
        display: false,
      },
      ticks: {
        color: '#8a919e',
        font: {
          family: "'DM Sans', sans-serif",
          size: 11,
        },
        callback: (value) => `$${(value / 1000).toFixed(0)}k`
      }
    },
    y: {
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
      ticks: {
        color: '#5b616e',
        font: {
          family: "'DM Sans', sans-serif",
          size: 11,
        }
      }
    }
  }
}
</script>

<template>
  <div class="p-4 bg-[#f9fafb] rounded-xl">
    <p class="text-xs text-[#8a919e] mb-1">Top 10</p>
    <p class="text-sm font-medium text-[#0a0b0d] mb-4">Merchants</p>
    <div class="h-72">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

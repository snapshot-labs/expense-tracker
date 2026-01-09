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

const { monthlyData, getMerchantColor } = useTransactions()

const chartData = computed(() => ({
  labels: monthlyData.value.labels,
  datasets: monthlyData.value.merchantBreakdown.map((merchant) => ({
    label: merchant.merchant.length > 18 
      ? merchant.merchant.substring(0, 18) + '...' 
      : merchant.merchant,
    data: merchant.values,
    backgroundColor: getMerchantColor(merchant.merchant),
    borderWidth: 0,
    borderRadius: 4,
  }))
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 16,
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
          const fullLabel = monthlyData.value.merchantBreakdown[context.datasetIndex]?.merchant || context.dataset.label
          return `${fullLabel}: $${context.parsed.y.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
        },
        footer: (tooltipItems) => {
          const total = tooltipItems.reduce((sum, item) => sum + item.parsed.y, 0)
          return `Total: $${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
        }
      }
    }
  },
  interaction: {
    mode: 'index',
    intersect: false,
  },
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
      ticks: {
        color: '#8a919e',
        font: {
          family: "'DM Sans', sans-serif",
          size: 11,
        }
      }
    },
    y: {
      stacked: true,
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
    }
  }
}
</script>

<template>
  <div class="p-4 bg-[#f9fafb] rounded-xl">
    <p class="text-xs text-[#8a919e] mb-1">Monthly spending</p>
    <p class="text-sm font-medium text-[#0a0b0d] mb-4">By merchant</p>
    <div class="h-64">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

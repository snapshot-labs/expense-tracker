<script setup>
import { useTransactions } from '../composables/useTransactions'
import { formatCurrency } from '../utils/csvParser'

const { totalSpent, transactionCount, averageTransaction, topCategory } = useTransactions()
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
    <div class="p-4 bg-[#f9fafb] rounded-xl">
      <p class="text-xs text-[#8a919e] mb-1">Total spent</p>
      <p class="text-xl font-semibold text-[#0a0b0d]">{{ formatCurrency(totalSpent) }}</p>
    </div>
    
    <div class="p-4 bg-[#f9fafb] rounded-xl">
      <p class="text-xs text-[#8a919e] mb-1">Transactions</p>
      <p class="text-xl font-semibold text-[#0a0b0d]">{{ transactionCount.toLocaleString() }}</p>
    </div>
    
    <div class="p-4 bg-[#f9fafb] rounded-xl">
      <p class="text-xs text-[#8a919e] mb-1">Average</p>
      <p class="text-xl font-semibold text-[#0a0b0d]">{{ formatCurrency(averageTransaction) }}</p>
    </div>
    
    <div class="p-4 bg-[#f9fafb] rounded-xl">
      <p class="text-xs text-[#8a919e] mb-1">Top category</p>
      <p class="text-lg font-semibold text-[#0a0b0d] truncate">{{ topCategory }}</p>
    </div>
  </div>
</template>

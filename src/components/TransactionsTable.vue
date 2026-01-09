<script setup>
import { useTransactions } from '../composables/useTransactions'
import { formatCurrency, formatDate } from '../utils/csvParser'

const { sortedTransactions, getMerchantColor } = useTransactions()

const searchQuery = ref('')
const statusFilter = ref('all')
const currentPage = ref(1)
const itemsPerPage = 20

const statusOptions = ['all', 'Cleared', 'Declined', 'Voided', 'Refunded', 'Pending']

const filteredTransactions = computed(() => {
  let result = sortedTransactions.value

  if (statusFilter.value !== 'all') {
    result = result.filter(t => t.status === statusFilter.value)
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(t => 
      t.merchant.toLowerCase().includes(query) ||
      t.category.toLowerCase().includes(query)
    )
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredTransactions.value.length / itemsPerPage))

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredTransactions.value.slice(start, start + itemsPerPage)
})

const statusStyle = (status) => {
  const styles = {
    'Cleared': 'bg-[#e8f5e9] text-[#0a0b0d]',
    'Declined': 'bg-[#fce4ec] text-[#cf202f]',
    'Voided': 'bg-[#f5f5f5] text-[#5b616e]',
    'Refunded': 'bg-[#e3f2fd] text-[#0a0b0d]',
    'Pending': 'bg-[#fff8e1] text-[#0a0b0d]',
  }
  return styles[status] || 'bg-[#f5f5f5] text-[#5b616e]'
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
</script>

<template>
  <div class="bg-[#f9fafb] rounded-xl overflow-hidden">
    <div class="p-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-xs text-[#8a919e]">All</p>
        <p class="text-sm font-medium text-[#0a0b0d]">Transactions</p>
      </div>
      
      <div class="flex flex-wrap items-center gap-2">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            class="w-48 pl-8 pr-3 py-1.5 text-sm bg-white border border-[#e5e5e5] rounded-full focus:outline-none focus:border-[#0a0b0d] text-[#0a0b0d] placeholder-[#8a919e]"
          />
          <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a919e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <select
          v-model="statusFilter"
          class="px-3 py-1.5 text-sm bg-white border border-[#e5e5e5] rounded-full focus:outline-none focus:border-[#0a0b0d] text-[#0a0b0d] cursor-pointer"
        >
          <option v-for="status in statusOptions" :key="status" :value="status">
            {{ status === 'all' ? 'All status' : status }}
          </option>
        </select>
      </div>
    </div>
    
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-t border-[#e5e5e5] bg-white">
            <th class="px-4 py-2.5 text-left text-xs font-medium text-[#8a919e]">Date</th>
            <th class="px-4 py-2.5 text-left text-xs font-medium text-[#8a919e]">Merchant</th>
            <th class="px-4 py-2.5 text-left text-xs font-medium text-[#8a919e]">Category</th>
            <th class="px-4 py-2.5 text-left text-xs font-medium text-[#8a919e]">Status</th>
            <th class="px-4 py-2.5 text-right text-xs font-medium text-[#8a919e]">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="transaction in paginatedTransactions" 
            :key="transaction.receiptId"
            class="border-t border-[#e5e5e5] bg-white hover:bg-[#fafafa] transition-colors"
          >
            <td class="px-4 py-2.5 text-[#5b616e] whitespace-nowrap">{{ formatDate(transaction.date) }}</td>
            <td class="px-4 py-2.5 text-[#0a0b0d] font-medium max-w-[180px]">
              <span class="flex items-center gap-2">
                <span 
                  class="w-2 h-2 rounded-full flex-shrink-0" 
                  :style="{ backgroundColor: getMerchantColor(transaction.merchant) }"
                ></span>
                <span class="truncate">{{ transaction.merchant }}</span>
              </span>
            </td>
            <td class="px-4 py-2.5 text-[#5b616e]">{{ transaction.category }}</td>
            <td class="px-4 py-2.5">
              <span :class="['px-2 py-0.5 text-xs font-medium rounded-full', statusStyle(transaction.status)]">
                {{ transaction.status }}
              </span>
            </td>
            <td class="px-4 py-2.5 text-right font-medium text-[#0a0b0d] whitespace-nowrap">
              {{ formatCurrency(transaction.chargedAmountUSD) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="p-4 border-t border-[#e5e5e5] bg-white flex items-center justify-between">
      <p class="text-xs text-[#8a919e]">
        {{ filteredTransactions.length.toLocaleString() }} transactions
      </p>
      
      <div class="flex items-center gap-2">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          class="w-8 h-8 flex items-center justify-center rounded-full bg-[#f5f5f5] text-[#5b616e] hover:bg-[#ebebeb] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <span class="text-xs text-[#5b616e] min-w-[80px] text-center">
          {{ currentPage }} of {{ totalPages || 1 }}
        </span>
        
        <button 
          @click="nextPage" 
          :disabled="currentPage >= totalPages"
          class="w-8 h-8 flex items-center justify-center rounded-full bg-[#f5f5f5] text-[#5b616e] hover:bg-[#ebebeb] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

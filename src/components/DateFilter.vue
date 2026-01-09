<script setup>
import { useTransactions } from '../composables/useTransactions'

const { 
  selectedYear, 
  selectedMonth, 
  selectedMerchant,
  selectedCategory,
  availableYears, 
  availableMonths,
  availableMerchants,
  availableCategories,
  monthNames 
} = useTransactions()

watch(selectedYear, () => {
  selectedMonth.value = 'all'
})

const hasActiveFilters = computed(() => 
  selectedYear.value !== 'all' || 
  selectedMonth.value !== 'all' || 
  selectedMerchant.value !== 'all' || 
  selectedCategory.value !== 'all'
)

const clearAllFilters = () => {
  selectedYear.value = 'all'
  selectedMonth.value = 'all'
  selectedMerchant.value = 'all'
  selectedCategory.value = 'all'
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-3 mb-5">
    <span class="text-xs font-medium text-[#8a919e] uppercase tracking-wide">Filter</span>
    
    <select
      v-model="selectedYear"
      class="px-3 py-1.5 text-sm bg-[#f5f5f5] border-0 rounded-full text-[#0a0b0d] focus:outline-none focus:ring-2 focus:ring-[#0a0b0d] focus:ring-offset-1 cursor-pointer"
    >
      <option value="all">All years</option>
      <option v-for="year in availableYears" :key="year" :value="year">
        {{ year }}
      </option>
    </select>
    
    <select
      v-model="selectedMonth"
      :disabled="selectedYear === 'all'"
      class="px-3 py-1.5 text-sm bg-[#f5f5f5] border-0 rounded-full text-[#0a0b0d] focus:outline-none focus:ring-2 focus:ring-[#0a0b0d] focus:ring-offset-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <option value="all">All months</option>
      <option v-for="month in availableMonths" :key="month" :value="month">
        {{ monthNames[month] }}
      </option>
    </select>
    
    <select
      v-model="selectedMerchant"
      class="px-3 py-1.5 text-sm bg-[#f5f5f5] border-0 rounded-full text-[#0a0b0d] focus:outline-none focus:ring-2 focus:ring-[#0a0b0d] focus:ring-offset-1 cursor-pointer max-w-[180px]"
    >
      <option value="all">All merchants</option>
      <option v-for="merchant in availableMerchants" :key="merchant" :value="merchant">
        {{ merchant }}
      </option>
    </select>
    
    <select
      v-model="selectedCategory"
      class="px-3 py-1.5 text-sm bg-[#f5f5f5] border-0 rounded-full text-[#0a0b0d] focus:outline-none focus:ring-2 focus:ring-[#0a0b0d] focus:ring-offset-1 cursor-pointer max-w-[180px]"
    >
      <option value="all">All categories</option>
      <option v-for="category in availableCategories" :key="category" :value="category">
        {{ category }}
      </option>
    </select>
    
    <button
      v-if="hasActiveFilters"
      @click="clearAllFilters"
      class="px-3 py-1.5 text-sm text-[#5b616e] hover:text-[#0a0b0d] transition-colors"
    >
      Clear
    </button>
  </div>
</template>

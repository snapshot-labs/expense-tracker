<script setup>
import { useTransactions } from './composables/useTransactions'

const { transactions, setTransactions, hasData } = useTransactions()

const handleFileLoaded = (data) => {
  setTransactions(data)
}

const handleReset = () => {
  setTransactions([])
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <header class="border-b border-[#e5e5e5]">
      <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <h1 class="text-base font-semibold text-[#0a0b0d]">Expense tracker</h1>
        <button 
          v-if="hasData" 
          @click="handleReset"
          class="px-4 py-1.5 text-sm font-medium text-[#5b616e] bg-[#f5f5f5] rounded-full hover:bg-[#ebebeb] transition-colors"
        >
          Upload new file
        </button>
      </div>
    </header>
    
    <main class="max-w-6xl mx-auto px-4 py-6">
      <DropZone v-if="!hasData" @file-loaded="handleFileLoaded" />
      <Dashboard v-else />
    </main>
  </div>
</template>

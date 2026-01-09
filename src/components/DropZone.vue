<script setup>
import { parseCSV } from '../utils/csvParser'

const emit = defineEmits(['file-loaded'])

const isDragging = ref(false)
const isLoading = ref(false)
const error = ref(null)

const handleDragOver = (e) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const handleDrop = (e) => {
  e.preventDefault()
  isDragging.value = false
  
  const files = e.dataTransfer.files
  if (files.length > 0) {
    processFile(files[0])
  }
}

const handleFileSelect = (e) => {
  const files = e.target.files
  if (files.length > 0) {
    processFile(files[0])
  }
}

const processFile = async (file) => {
  if (!file.name.endsWith('.csv')) {
    error.value = 'Please upload a CSV file'
    return
  }
  
  error.value = null
  isLoading.value = true
  
  try {
    const text = await file.text()
    const data = parseCSV(text)
    emit('file-loaded', data)
  } catch (err) {
    error.value = 'Failed to parse CSV file: ' + err.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20">
    <div
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      :class="[
        'w-full max-w-md h-64 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl transition-all cursor-pointer',
        isDragging 
          ? 'border-[#0a0b0d] bg-[#f9fafb]' 
          : 'border-[#e5e5e5] hover:border-[#d1d5db] bg-white'
      ]"
    >
      <div v-if="isLoading" class="text-center">
        <div class="w-8 h-8 border-2 border-[#e5e5e5] border-t-[#0a0b0d] rounded-full animate-spin mx-auto mb-3"></div>
        <p class="text-sm text-[#5b616e]">Processing...</p>
      </div>
      
      <div v-else class="text-center px-6">
        <div class="w-12 h-12 mx-auto mb-4 bg-[#f5f5f5] rounded-full flex items-center justify-center">
          <svg class="w-5 h-5 text-[#5b616e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        <p class="text-sm font-medium text-[#0a0b0d] mb-1">
          Drop your CSV file here
        </p>
        <p class="text-sm text-[#8a919e] mb-4">
          or click to browse
        </p>
        
        <label class="inline-block px-5 py-2 bg-[#0a0b0d] text-white text-sm font-medium rounded-full cursor-pointer hover:bg-[#1a1a1a] transition-colors">
          Select file
          <input 
            type="file" 
            accept=".csv" 
            @change="handleFileSelect" 
            class="hidden"
          />
        </label>
      </div>
    </div>
    
    <p v-if="error" class="mt-3 text-sm text-[#cf202f]">
      {{ error }}
    </p>
    
    <p class="mt-6 text-xs text-[#8a919e]">
      Supports Reap transaction CSV format
    </p>
  </div>
</template>

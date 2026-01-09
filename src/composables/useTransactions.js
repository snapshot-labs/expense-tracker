import { ref, computed } from 'vue'
import { getMonthKey, formatMonthLabel } from '../utils/csvParser'

const transactions = ref([])
const selectedYear = ref('all')
const selectedMonth = ref('all')
const selectedMerchant = ref('all')
const selectedCategory = ref('all')

export function useTransactions() {
  const setTransactions = (data) => {
    transactions.value = data
    selectedYear.value = 'all'
    selectedMonth.value = 'all'
    selectedMerchant.value = 'all'
    selectedCategory.value = 'all'
  }

  const hasData = computed(() => transactions.value.length > 0)

  // Available years for filter
  const availableYears = computed(() => {
    const years = new Set()
    transactions.value.forEach(t => {
      if (t.date) {
        years.add(t.date.getFullYear())
      }
    })
    return Array.from(years).sort((a, b) => b - a)
  })

  // Available months for filter (based on selected year)
  const availableMonths = computed(() => {
    if (selectedYear.value === 'all') {
      return []
    }
    const months = new Set()
    transactions.value.forEach(t => {
      if (t.date && t.date.getFullYear() === parseInt(selectedYear.value)) {
        months.add(t.date.getMonth())
      }
    })
    return Array.from(months).sort((a, b) => a - b)
  })

  // Month names for display
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  // Available merchants for filter (from all transactions)
  const availableMerchants = computed(() => {
    const merchants = new Set()
    transactions.value.forEach(t => {
      if (t.merchant) {
        merchants.add(t.merchant)
      }
    })
    return Array.from(merchants).sort((a, b) => a.localeCompare(b))
  })

  // Available categories for filter (from all transactions)
  const availableCategories = computed(() => {
    const categories = new Set()
    transactions.value.forEach(t => {
      if (t.category) {
        categories.add(t.category)
      }
    })
    return Array.from(categories).sort((a, b) => a.localeCompare(b))
  })

  // Filter transactions by year, month, merchant, and category
  const filteredTransactions = computed(() => {
    let result = transactions.value

    if (selectedYear.value !== 'all') {
      const year = parseInt(selectedYear.value)
      result = result.filter(t => t.date && t.date.getFullYear() === year)
    }

    if (selectedMonth.value !== 'all') {
      const month = parseInt(selectedMonth.value)
      result = result.filter(t => t.date && t.date.getMonth() === month)
    }

    if (selectedMerchant.value !== 'all') {
      result = result.filter(t => t.merchant === selectedMerchant.value)
    }

    if (selectedCategory.value !== 'all') {
      result = result.filter(t => t.category === selectedCategory.value)
    }

    return result
  })

  // Filter only cleared transactions for spending analysis
  const clearedTransactions = computed(() => 
    filteredTransactions.value.filter(t => t.status === 'Cleared' && t.chargedAmountUSD > 0)
  )

  // Total spending
  const totalSpent = computed(() => 
    clearedTransactions.value.reduce((sum, t) => sum + t.chargedAmountUSD, 0)
  )

  // Transaction counts
  const transactionCount = computed(() => clearedTransactions.value.length)

  // Average transaction
  const averageTransaction = computed(() => 
    transactionCount.value > 0 ? totalSpent.value / transactionCount.value : 0
  )

  // Monthly spending data with merchant breakdown
  const monthlyData = computed(() => {
    const byMonth = {}
    const merchantsSet = new Set()
    
    clearedTransactions.value.forEach(t => {
      const key = getMonthKey(t.date)
      const merchant = t.merchant || 'Unknown'
      merchantsSet.add(merchant)
      
      if (!byMonth[key]) {
        byMonth[key] = { total: 0, count: 0, merchants: {} }
      }
      byMonth[key].total += t.chargedAmountUSD
      byMonth[key].count++
      
      if (!byMonth[key].merchants[merchant]) {
        byMonth[key].merchants[merchant] = 0
      }
      byMonth[key].merchants[merchant] += t.chargedAmountUSD
    })

    const sortedKeys = Object.keys(byMonth).sort()
    
    // Get top merchants across all months for consistent coloring
    const merchantTotals = {}
    clearedTransactions.value.forEach(t => {
      const merchant = t.merchant || 'Unknown'
      merchantTotals[merchant] = (merchantTotals[merchant] || 0) + t.chargedAmountUSD
    })
    
    const topMerchants = Object.entries(merchantTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name]) => name)
    
    // Build datasets for each top merchant + "Others"
    const merchantDatasets = topMerchants.map(merchant => ({
      merchant,
      values: sortedKeys.map(k => byMonth[k].merchants[merchant] || 0)
    }))
    
    // Calculate "Others" for each month
    const othersValues = sortedKeys.map(k => {
      const monthData = byMonth[k]
      const topMerchantTotal = topMerchants.reduce(
        (sum, m) => sum + (monthData.merchants[m] || 0), 
        0
      )
      return monthData.total - topMerchantTotal
    })
    
    if (othersValues.some(v => v > 0)) {
      merchantDatasets.push({
        merchant: 'Others',
        values: othersValues
      })
    }
    
    return {
      labels: sortedKeys.map(formatMonthLabel),
      values: sortedKeys.map(k => byMonth[k].total),
      counts: sortedKeys.map(k => byMonth[k].count),
      merchantBreakdown: merchantDatasets,
    }
  })

  // Category breakdown
  const categoryData = computed(() => {
    const byCategory = {}
    
    clearedTransactions.value.forEach(t => {
      const category = t.category || 'Uncategorized'
      if (!byCategory[category]) {
        byCategory[category] = 0
      }
      byCategory[category] += t.chargedAmountUSD
    })

    const sorted = Object.entries(byCategory)
      .sort((a, b) => b[1] - a[1])
    
    return {
      labels: sorted.map(([k]) => k),
      values: sorted.map(([, v]) => v),
    }
  })

  // Top category
  const topCategory = computed(() => {
    if (categoryData.value.labels.length === 0) return 'N/A'
    return categoryData.value.labels[0]
  })

  // Merchant colors (same as charts)
  const merchantColors = [
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
    '#009688', // teal
    '#ff9800', // deep orange
    '#673ab7', // deep purple
    '#2196f3', // light blue
    '#4caf50', // green
    '#f44336', // red
    '#607d8b', // blue grey
    '#795548', // brown
    '#cddc39', // lime
    '#03a9f4', // sky blue
  ]

  // Top merchants
  const merchantData = computed(() => {
    const byMerchant = {}
    
    clearedTransactions.value.forEach(t => {
      const merchant = t.merchant || 'Unknown'
      if (!byMerchant[merchant]) {
        byMerchant[merchant] = 0
      }
      byMerchant[merchant] += t.chargedAmountUSD
    })

    const sorted = Object.entries(byMerchant)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
    
    return {
      labels: sorted.map(([k]) => k),
      values: sorted.map(([, v]) => v),
    }
  })

  // Merchant to color mapping (based on ALL transactions, not filtered)
  const merchantColorMap = computed(() => {
    const byMerchant = {}
    
    // Use all transactions to ensure consistent colors
    transactions.value.forEach(t => {
      if (t.status === 'Cleared' && t.chargedAmountUSD > 0) {
        const merchant = t.merchant || 'Unknown'
        byMerchant[merchant] = (byMerchant[merchant] || 0) + t.chargedAmountUSD
      }
    })

    const topMerchants = Object.entries(byMerchant)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([name]) => name)

    const map = {}
    topMerchants.forEach((merchant, index) => {
      map[merchant] = merchantColors[index % merchantColors.length]
    })
    return map
  })

  // Get color for a merchant
  const getMerchantColor = (merchant) => {
    return merchantColorMap.value[merchant] || '#9ca3af'
  }

  // Status breakdown
  const statusData = computed(() => {
    const byStatus = {}
    
    filteredTransactions.value.forEach(t => {
      const status = t.status || 'Unknown'
      if (!byStatus[status]) {
        byStatus[status] = 0
      }
      byStatus[status]++
    })

    return {
      labels: Object.keys(byStatus),
      values: Object.values(byStatus),
    }
  })

  // All transactions for table (sorted by date, newest first)
  const sortedTransactions = computed(() => 
    [...filteredTransactions.value].sort((a, b) => {
      if (!a.date) return 1
      if (!b.date) return -1
      return b.date - a.date
    })
  )

  return {
    transactions,
    setTransactions,
    hasData,
    selectedYear,
    selectedMonth,
    selectedMerchant,
    selectedCategory,
    availableYears,
    availableMonths,
    availableMerchants,
    availableCategories,
    monthNames,
    filteredTransactions,
    clearedTransactions,
    totalSpent,
    transactionCount,
    averageTransaction,
    monthlyData,
    categoryData,
    topCategory,
    merchantData,
    merchantColorMap,
    getMerchantColor,
    statusData,
    sortedTransactions,
  }
}

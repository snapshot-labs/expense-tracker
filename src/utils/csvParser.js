import Papa from 'papaparse'

export function parseCSV(csvText) {
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  })

  if (result.errors.length > 0) {
    console.warn('CSV parsing warnings:', result.errors)
  }

  return result.data.map((row) => ({
    date: parseDate(row['Date (UTC)']),
    dateCleared: row['Date Cleared (UTC)'] ? parseDate(row['Date Cleared (UTC)']) : null,
    status: row['Status'] || 'Unknown',
    cardholderName: row['Cardholder Name'] || '',
    cardholderDepartment: row['Cardholder Department'] || '',
    merchant: row['Merchant'] || 'Unknown',
    category: row['Category'] || 'Uncategorized',
    currency: row['Currency'] || 'USD',
    amount: parseFloat(row['Amount']) || 0,
    exchangedRate: parseFloat(row['Exchanged rate']) || 1,
    chargedAmountUSD: parseFloat(row['Charged amount (USD)']) || 0,
    cardName: row['Card name'] || '',
    last4: row['Last 4'] || '',
    receiptName: row['Receipt name'] || '',
    group: row['Group'] || '',
    notes: row['Notes'] || '',
    transactionId: row['Card Transaction ID'] || '',
  }))
}

function parseDate(dateStr) {
  if (!dateStr) return null
  const [datePart, timePart] = dateStr.split(' ')
  if (!datePart) return null
  
  const [year, month, day] = datePart.split('-').map(Number)
  const [hours, minutes] = timePart ? timePart.split(':').map(Number) : [0, 0]
  
  return new Date(year, month - 1, day, hours, minutes)
}

export function getMonthKey(date) {
  if (!date) return 'Unknown'
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

export function formatMonthLabel(monthKey) {
  if (monthKey === 'Unknown') return 'Unknown'
  const [year, month] = monthKey.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1, 1)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date) {
  if (!date) return '-'
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

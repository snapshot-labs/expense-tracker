<script setup>
</script>

<template>
  <div>
    <DateFilter />
    <SummaryCards />
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
      <div class="lg:col-span-2">
        <MonthlyChart />
      </div>
      <CategoryChart />
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
      <div class="lg:col-span-2">
        <MerchantChart />
      </div>
      <StatusBreakdown />
    </div>
    
    <TransactionsTable />
  </div>
</template>

<route lang="json">
{
  "meta": {
    "title": "History",
    "requiresAuth": true
  }
}
</route>
<script setup lang="ts">
import LoadingIcon from '@/assets/icons/loading.svg?url'

import { useAccountStore } from '../../stores'

const store = useAccountStore()

const balanceHistory = computed(() => store.balanceHistory)

const loading = ref(false)

// const fromISOStringToOnlyDate = (date: string) => {
//   const dateObj = new Date(date)
//   return `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`
// }

onMounted(() => {
  loading.value = true

  store.loadAccountBalanceHistory('', '').finally(() => {
    loading.value = false
  })
})
const handleFilterFromTo = (datetimes: { from: string; to: string }) => {
  loading.value = true
  // store.loadAccountBalanceHistory(fromISOStringToOnlyDate(datetimes.from), fromISOStringToOnlyDate(datetimes.to)).finally(() => {
  store.loadAccountBalanceHistory(datetimes.from, datetimes.to).finally(() => {
    loading.value = false
  })
}
</script>
<template>
  <Header />
  <div class="bg-white pt-header-safe min-h-full pb-4 flex flex-col px-2">
    <!-- <FromToDatePicker :loading="loading" class="mt-8" @dates="handleFilterFromTo" /> -->
    <FromToDateTimePicker :loading="loading" class="mt-2" @datetimes="handleFilterFromTo" />
    <div class="flex flex-col gap-y-[10px] mt-4 mx-2">
      <BalanceHistoryCard v-for="item in balanceHistory" :key="item.created" :data="item" />
    </div>
    <div v-if="loading" class="flex justify-center items-center h-[80vh]">
      <img class="animate-spin" :src="LoadingIcon" alt="" />
    </div>
  </div>
</template>

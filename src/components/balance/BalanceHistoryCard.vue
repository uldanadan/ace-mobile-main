<script lang="ts" setup>
import type { IBalanceHistory } from 'src/types/types'

defineProps<{
  data: IBalanceHistory
}>()

const formatISODate = (date: string) => {
  const dateObj = new Date(date)
  // return in format: 05.05.2021 12:00
  return `${dateObj.toLocaleDateString('ru-RU')} ${dateObj.toLocaleTimeString('ru-RU')}`
}
</script>
<template>
  <div class="flex items-center bg-white shadow-md rounded-lg px-4 py-6">
    <div class="text-md font-bold text-gray-800">
      {{ formatISODate(data.created).split(' ')[0] }} <br />
      {{ formatISODate(data.created).split(' ')[1] }}
    </div>
    <div
      class="text-lg font-bold ml-auto"
      :class="{
        'text-green-700': data.type === 'DEPOSIT',
        'text-yellow-700': data.type === 'REFUND',
        'text-red-700': data.type === 'WITHDRAW',
      }"
    >
      {{ data.type === 'DEPOSIT' ? '+' : data.type === 'WITHDRAW' ? '-' : '' }} {{ data.transaction_amount }}₸
    </div>
  </div>
</template>

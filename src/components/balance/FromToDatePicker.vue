<script lang="ts" setup>
import { ref } from 'vue'
const fromDate = ref('')
const toDate = ref('')

const emits = defineEmits(['dates'])

const getFromDate = () => {
  const theDate = new Date(`${fromDate.value}`)
  return theDate.toISOString()
}

const getToDate = () => {
  const theDate = new Date(`${toDate.value}`)
  return theDate.toISOString()
}

const getFromToDates = () => {
  emits('dates', {
    from: getFromDate(),
    to: getToDate(),
  })
}

onMounted(() => {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  fromDate.value = yesterday.toISOString().split('T')[0]
  toDate.value = today.toISOString().split('T')[0]
})
</script>
<template>
  <!-- datetime picker from date to date -->
  <div class="flex flex-col bg-white rounded-lg mx-2 p-4 shadow-md">
    <p class="text-lg font-bold text-center text-gray-900">Фильтрация</p>
    <div class="flex flex-col mt-4">
      <input type="date" class="border border-gray-300 rounded-md p-2" v-model="fromDate" />
    </div>
    <div class="flex flex-col mt-4">
      <input type="date" class="border w-full border-gray-300 rounded-md p-2" v-model="toDate" />
    </div>
    <div class="mt-2">
      <button
        @click="getFromToDates"
        class="group mt-2 relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Применить
      </button>
    </div>
  </div>
</template>

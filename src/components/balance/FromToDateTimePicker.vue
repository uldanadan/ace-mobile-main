<script lang="ts" setup>
import { ref } from 'vue'
const fromDate = ref('')
const toDate = ref('')
// const fromTime = ref('')
// const toTime = ref('')

const emits = defineEmits(['datetimes'])

const getFromDate = () => {
  const theDate = new Date(fromDate.value)
  return theDate.toISOString()
}

const getToDate = () => {
  const theDate = new Date(toDate.value)
  return theDate.toISOString()
}

const getFromToDates = () => {
  console.log('getFromToDates', getFromDate(), getToDate())

  emits('datetimes', {
    from: getFromDate(),
    to: getToDate(),
  })
}

onMounted(() => {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  fromDate.value = yesterday.toISOString().slice(0, 16).replace('T', ' ')
  toDate.value = today.toISOString().slice(0, 16).replace('T', ' ')

  console.log('fromDate', fromDate.value)

  // fromTime.value = '00:00'
  // toTime.value = '23:59'
})
</script>
<template>
  <!-- datetime picker from date to date -->
  <div class="mx-2 flex flex-col rounded-lg bg-white p-4 shadow-md">
    <p class="text-center text-lg font-bold text-gray-900">Выберите период</p>
    <div class="mt-2 flex flex-row justify-center">
      <div class="flex flex-col">
        <input type="datetime-local" id="meeting-time" name="meeting-time" class="rounded-md border border-gray-300 p-2" v-model="fromDate" @change="getFromToDates" />
      </div>
    </div>
    <div class="mt-4 flex flex-row justify-center">
      <div class="flex flex-col">
        <input type="datetime-local" id="meeting-time" name="meeting-time" class="rounded-md border border-gray-300 p-2" v-model="toDate" @change="getFromToDates" />
      </div>
    </div>
    <!-- <div class="mt-2">
      <button
        @click="getFromToDates"
        class="group mt-2 relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Применить
      </button>
    </div> -->
  </div>
</template>

<template>
  <div class="glass flex items-center justify-between gap-[14px] rounded-[10px] p-[15px] pr-[15px] shadow-md">
    <div v-if="reservation.started_at && !session.started_at" class="flex items-center gap-[10px]">
      <div>
        <img src="/logo/ace.png" class="aspect-1 max-w-[50px]" />
      </div>
      <div>
        <!-- сделать отменить бронь -->
        <p class="text-sm font-medium text-[#2d2d2d]">Активная бронь</p>
        <p class="text-[12px] font-normal leading-[22px] text-[#80808f]">
          ПК №{{ reservation.computer_number }}
          {{ formatISODate(reservation.started_at) }}
        </p>
      </div>
    </div>
    <div v-else-if="session.started_at">
      <div class="flex items-center gap-[10px]">
        <div>
          <img src="/logo/ace.png" class="aspect-1 max-w-[50px]" />
        </div>
        <div>
          <p class="text-sm font-medium text-[#2d2d2d]">Компьютер: №{{ session.computer_number }}</p>
          <p class="text-[12px] font-normal leading-[22px] text-[#80808f]">
            {{ sessionTime }}
          </p>
        </div>
      </div>
    </div>
    <div v-else class="flex items-center gap-[10px]">
      <div>
        <img src="/logo/ace.png" class="aspect-1 max-w-[50px]" />
      </div>
      <div class="flex flex-col gap-1">
        <h3 class="text-sm font-medium text-[#2d2d2d]">Добро пожаловать!</h3>
        <p class="text-[12px] font-normal leading-[22px] text-[#80808f]">
          <!-- {{ formattedTime }} -->
          acegaming.gg
        </p>
      </div>
    </div>
    <button v-if="reservation.started_at && !session.started_at" class="rounded-[10px] px-3 py-2 text-sm font-semibold text-violet-800" @click="() => emits('cancelReservation', reservation.uuid)">
      отменить
    </button>
    <button v-else-if="session.started_at" class="rounded-[10px] px-3 py-2 text-sm font-semibold text-violet-800" @click="() => emits('endSession', session.computer_id)">завершить</button>
    <router-link to="/about" v-else class="rounded-[10px] px-3 py-2 text-sm font-semibold text-violet-800" title="начать">
      <img width="30" height="30" :src="InfoIcon" />
    </router-link>
  </div>
</template>

<script setup lang="ts">
import InfoIcon from '../assets/icons/info_circle_outline_28.svg?url'

import { timeDiffCalc } from '../utils/format'

const props = defineProps<{
  reservation: {
    started_at: string
    computer_number: number
    computer_id: string
    uuid: string
  }
  session: {
    started_at: string
    computer_number: number
    computer_id: string
  }
}>()

const sessionTime = ref('00:00:00')
const sessionInterval = ref()

const emits = defineEmits(['cancelReservation', 'endSession'])

const formatISODate = (date: string) => {
  const d = new Date(date)
  const month = d.getMonth() + 1
  const day = d.getDate()
  const hours = d.getHours()
  const minutes = d.getMinutes()

  // with leading zeros
  const formattedDate = `${month < 10 ? `0${month}` : month}.${day < 10 ? `0${day}` : day}`
  const formattedTime = `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`

  return `${formattedDate} ${formattedTime}`
}

const getSessionTime = () => {
  if (!props.session.started_at || Number.isNaN(props.session.started_at)) return '00:00:00'
  const now = new Date()
  const startedAt = new Date(props.session.started_at)

  return timeDiffCalc(now, startedAt)
}

onBeforeMount(() => {
  sessionTime.value = getSessionTime()
  sessionInterval.value = setInterval(() => {
    sessionTime.value = getSessionTime()
  }, 1000)
})

const timeNow = new Date()
let formattedTime = timeNow.toLocaleString('ru-RU', {
  timeZone: 'Asia/Almaty',
})
</script>

<style scoped>
.glass {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  -webkit-box-shadow: 0px 0px 41px -10px rgba(34, 60, 80, 0.12);
  -moz-box-shadow: 0px 0px 41px -10px rgba(34, 60, 80, 0.12);
  box-shadow: 0px 0px 41px -10px rgba(34, 60, 80, 0.12);
}
</style>

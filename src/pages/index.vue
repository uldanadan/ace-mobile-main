<route lang="json">
{
  "meta": {
    "title": "Home",
    "requiresAuth": false
  }
}
</route>

<template>
  <div class="pt-header-safe h-screen">
    <QRSlideTop v-if="isQrSlid" />
    <MainSwiper v-if="!isQrSlid" />
    <div class="flex h-full flex-col">
      <div v-if="isQrSlid" class="flex h-[28vh] items-center justify-center bg-white pb-[67px] pt-9">
        <img class="animate-spin" :src="LoadingIcon" alt="" />
      </div>
      <div class="relative z-10 flex flex-grow flex-col items-center rounded-t-xl bg-white pt-[20px]">
        <MainMenu />
        <div v-if="qrResponseStatus !== ''" class="absolute flex h-3/6 w-full items-center justify-center rounded-[10px] bg-white px-[60px] text-center">
          {{ qrResponseStatus }}
        </div>
        <div class="mt-6 flex w-[90%] flex-col gap-[15px]">
          <!-- <div class="text-[#2d2d2d] text-base leading-5 font-semibold ml-[15px]">Последние действия</div> -->
          <ActivityCard :reservation="reservation" :session="session" @endSession="handleEndSession" @cancelReservation="handleCancelReservation" />
        </div>
        <!-- <div class="flex flex-col w-[90%] gap-[15px] mt-6">
      <div class="text-[#2d2d2d] text-base leading-5 font-semibold ml-[15px]">Последняя активность</div>
      <ActivityCard activityType="recent"/>
    </div> -->
      </div>
    </div>
    <div id="blur-loading" class="align-center blur_loading pointer-events-none absolute top-0 z-[4] flex hidden h-[100vh] items-center">
      <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
        <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAccountStore } from '../stores'
import LoadingIcon from '../assets/icons/loading.svg?url'
import { BarcodeScanner } from '@capacitor-community/barcode-scanner'
const store = useAccountStore()

const qrResponseStatus = computed(() => store.qrResponseStatus)
const isQrSlid = computed(() => store.qrSlide)
const reservation = computed(() => store.reservation)
const session = computed(() => store.session)

const handleCloseQr = () => {
  store.switchQrSlide()
}

const handleEndSession = (computerId: string) => {
  showLoading()
  store.logoutComputer(computerId)
  store.clearSession()
}

const handleCancelReservation = (reservation_id: string) => {
  showLoading()
  store.deleteReservation(reservation_id)
  store.clearReservation()
}

const showLoading = () => {
  let blur = (document.getElementById('blur-loading') as HTMLElement) || null
  blur?.classList.remove('hidden')
  document.body.scrollTop = 0
  document.documentElement.scrollTop = 0
  setTimeout(() => {
    blur.classList.add('hidden')
  }, 2500)
}

onMounted(() => {
  if (store.getToken) {
    store.checkAccount()
    store.loadReservation()
    store.loadSession()
  }
  setTimeout(() => {
    store.setQrResponse('')
  }, 1500)
})
</script>

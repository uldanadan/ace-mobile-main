<route lang="json">
{
  "meta": {
    "title": "Receipt",
    "requiresAuth": true
  }
}
</route>

<template>
  <div class="h-full flex pt-header-safe flex-col justify-start">
    <div class="bg-[#9475ed] text-[#f7f8fc] pt-[84px] pb-[100px] px-[25px] flex flex-col items-center">
      <img :src="ReceiptIcon" alt="" width="64" height="64" class="mb-[25px]" />
      <h2 class="font-bold text-2xl tracking-[1px]">Компьютер № {{ bookedPc[0]?.number }}</h2>
      <h4 class="font-bold text-2xl mb-16">Успешно забронирован</h4>
      <p class="font-normal text-xl leading-6 text-center">Квитанция об оплате будет отправлена вам на почту</p>
    </div>
    <div class="bg-[#ffffff] pt-[185px] pb-9 px-[15px] flex flex-col items-center gap-[15px] h-full justify-end">
      <button @click="goTo('/')" class="bg-[#9475ed] rounded-[10px] text-[#f7f8fc] font-medium text-base leading-[19px] py-[15px] w-[345px]">Вернуться на главную</button>
      <!-- <button
            class="bg-transparent rounded-[10px] text-[#9475ed] font-medium text-base leading-[19px] py-[15px] w-[345px] border-[1px] border-solid border-[#9475ed]">Посмотреть
            детали</button> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAccountStore } from '../stores'
import ReceiptIcon from '../assets/icons/receipt-icon.svg?url'

const router = useRouter()
const goTo = (path: string) => {
  router.push(path)
}

const store = useAccountStore()
const bookedPc = computed<Array<any>>(() => store.bookedPc)
</script>

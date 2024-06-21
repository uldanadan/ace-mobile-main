<template>
  <div v-if="menuItem" :class="{ 'pointer-events-none touch-none': !menuItem.isAvailable }" @click="goToPage">
    <div v-if="menuItem" class="flex w-[72px] flex-col items-center justify-between text-[13px] font-normal leading-4">
      <div class="skwm relative mb-[10px] rounded-[12px] border-2 border-violet-800 p-[0.4rem]">
        <img :src="menuItem.img" alt="" width="30" height="30" />
        <span v-if="!menuItem.isAvailable"
          class="absolute bottom-[-4px] left-6 h-[14px] w-9 rounded-[10px] bg-violet-200 text-center text-[9px] font-normal leading-[14px] text-[#2a2a32]">Скоро</span>
      </div>
      <span class="font-semibold">{{ menuItem.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { useAccountStore } from '../stores'

export interface MenuItem {
  img: string
  name: string
  page: string
  isAvailable: boolean
  isExternal: boolean
}

const router = useRouter()
const accountStore = useAccountStore()

const props = defineProps({
  menuItem: {
    type: Object as PropType<MenuItem>,
  },
})

const goToPage = () => {
  if (!props.menuItem || !props.menuItem.isAvailable) return
  if (props.menuItem.isExternal) {
    window.location.href = props.menuItem.page
    return
  } else {
    router.push(props.menuItem.page)
    accountStore.setNextRoute(props.menuItem.page)
    return
  }
  // else if (props.menuItem.page == 'QR') {
  //   accountStore.switchQrSlide()
  //   return
  // } 
}
</script>

<template>
  <router-link :to="`/clubs/${clubCardItem?.uuid}`">
    <div class="flex flex-col overflow-hidden rounded-[10px] bg-white shadow-lg">
      <div class="flex h-[150px] items-center justify-center">
        <img :src="`${clubCardItem?.image}`" alt=" " class="w-full object-cover" />
        <div v-if="!clubCardItem?.isAvailable" class="z-5 absolute text-lg font-semibold leading-[22px] text-[#f7f8fc]">Закрыто</div>
      </div>
      <div class="flex items-center justify-between border-b-[1px] border-dashed border-[#c7c7c7] p-[10px]">
        <div class="text-[#2a2a43]">
          <div class="mb-[5px] text-lg font-semibold leading-[22px]">{{ clubCardItem?.name }}</div>
          <div class="text-sm font-normal leading-[19px]">{{ clubCardItem?.address }}</div>
        </div>
        <div class="flex items-center rounded-[10px] bg-slate-100 p-[10px] text-center text-xs font-semibold leading-[15px] text-[#9475ed]">Есть места</div>
      </div>
      <div class="flex items-center gap-x-2 py-2 pl-[15px]">
        <div class="flex text-sm font-normal leading-[17px]">
          <img class="mr-[6px]" :src="StarIcon" alt="" width="16" height="16" />
          {{ clubCardItem?.rating }}
        </div>
        ·
        <div class="text-xs">$$$$</div>
        ·
        <div class="flex text-sm font-normal leading-[17px]">
          <img class="mr-[6px]" :src="ClockIcon" alt="" width="14" height="14" />
          Круглосуточно
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
  import type { PropType } from "vue";
  import StarIcon from "../assets/icons/favorite_outline_20.svg?url";
  import ClockIcon from "../assets/icons/clock_outline_20.svg?url";
  import MoneyIcon from "../assets/icons/money-icon.svg?url";
  import type { ClubInfo } from "../types/types";

  const props = defineProps({
    clubCardItem: {
      type: Object as PropType<ClubInfo>,
    },
  });
</script>

<style scoped>
  img {
    height: inherit;
  }
</style>

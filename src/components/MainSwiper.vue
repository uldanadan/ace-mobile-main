<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { Autoplay, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'

import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/pagination'

import { useMarketingStore } from '../stores'
const marketingStore = useMarketingStore()

const bannerLoader = ref(false)

const bannerList = computed(() => {
  return marketingStore.getBannerList
})

const modules = [Autoplay, Pagination]

onMounted(() => {
  bannerLoader.value = true
  if (bannerList.value.length > 0) {
    bannerLoader.value = false
    return
  }
  marketingStore.loadBanners().finally(() => {
    bannerLoader.value = false
  })
})

const onSwiper = (swiper: any) => {
  // console.log(swiper);
}
const onSlideChange = () => {
  // console.log("slide change");
}
</script>
<template>
  <div class="max-w-screen-md">
    <div v-if="!bannerLoader">
      <swiper
        :modules="modules"
        :slides-per-view="1"
        :pagination="{
          type: 'bullets',
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet--active',
        }"
        @swiper="onSwiper"
        @slideChange="onSlideChange"
        :autoplay="{
          delay: 3000,
          disableOnInteraction: false,
        }"
        :loop="true"
      >
        <template v-for="(banner, idx) in bannerList" :key="idx">
          <swiper-slide>
            <div class="flex items-center px-3 pb-3 pt-3">
              <img class="h-[25vh] w-full rounded-[10px] object-cover" :src="banner.image" />
            </div>
          </swiper-slide>
        </template>
      </swiper>
    </div>
    <div class="w-full px-3 pb-3 pt-3" v-else>
      <div class="h-[25vh] w-full rounded-[10px] bg-gray-100"></div>
    </div>
  </div>
</template>
<style>
.swiper-pagination {
  bottom: -5px !important;
  width: 100% !important;
}
.swiper-pagination-bullet {
  width: 20px;
  height: 5px;
  background: #5b21b6;
  opacity: 0.5;
  border-radius: 4px;
}
.swiper-pagination-bullet--active {
  opacity: 1;
}
</style>

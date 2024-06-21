<template>
  <div class="mx-auto mb-5 rounded-[10px] mt-[25px]">
    <div class="relative">
      <div ref="container" class="keen-slider" v-if="bannerList">
        <div v-for="(banner, index) in bannerList" :key="index" class="keen-slider__slide rounded-[10px]" :class="`number-slide${index + 1}`">
          <img :src="banner['image']" alt="" class="rounded-[10px]" />
        </div>
      </div>
    </div>
    <div v-if="slider" class="flex justify-center py-2.5 px-0">
      <button
        v-for="(_slide, idx) in dotHelper"
        @click="slider?.moveToIdx(idx)"
        :class="{
          ['border-none h-1 w-5 rounded-lg my-0 mx-1 cursor-pointer focus:outline-none']: true,
          ['bg-[#9475ed]']: current === idx,
          ['bg-[#e5dff8]']: current !== idx,
        }"
        :key="idx"
      ></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useKeenSlider } from 'keen-slider/vue.es'
import { useMarketingStore } from '../stores'

const marketingStore = useMarketingStore()
const bannerList = computed(() => {
  // console.log(marketingStore.bannerList);
  return marketingStore.getBannerList
})

const current = ref(1)
const [container, slider] = useKeenSlider(
  {
    initial: current.value,
    loop: true,
    // slideChanged: (s) => {
    //   current.value = s.track.details.rel;
    // },
  },
  [
    (slider) => {
      let timeout: ReturnType<typeof setTimeout>
      let mouseOver = false
      function clearNextTimeout() {
        clearTimeout(timeout)
      }
      function nextTimeout() {
        clearTimeout(timeout)
        if (mouseOver) return
        timeout = setTimeout(() => {
          slider.next()
        }, 5000)
      }
      slider.on('created', () => {
        slider.container.addEventListener('mouseover', () => {
          mouseOver = true
          clearNextTimeout()
        })
        slider.container.addEventListener('mouseout', () => {
          mouseOver = false
          nextTimeout()
        })
        nextTimeout()
      })
      slider.on('dragStarted', clearNextTimeout)
      slider.on('animationEnded', nextTimeout)
      slider.on('updated', nextTimeout)
      slider.on('destroyed', () => {
        const slidesArr = document.querySelectorAll('.keen-slider__slide')
        slidesArr.forEach((slide) => {
          slide.setAttribute('style', 'min-width: 100vw;')
        })
      })
    },
  ]
)

const dotHelper = computed(() => (slider.value ? [...Array(slider.value.track.details.slides.length).keys()] : []))

onMounted(() => {
  marketingStore.loadBanners()
})
</script>
<style>
@import url('keen-slider/keen-slider.css');

[class^='number-slide'],
[class*=' number-slide'] {
  background: #fff;
  display: flex !important;
  flex-direction: column;
  align-items: center;
  height: 200px;
  padding: 0 15px;
}

[class^='number-slide'] > img,
[class*=' number-slide'] > img {
  height: 200px !important;
  width: 100%;
}
</style>

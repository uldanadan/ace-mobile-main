<script lang="ts" setup>
/// <reference path="../../../node_modules/@2gis/mapgl/global.d.ts" />
import { load } from '@2gis/mapgl'

const map = ref<mapgl.Map>()

const initMap = async () => {
  const mapgl = await load()
  map.value = new mapgl.Map('map', {
    center: [37.64, 55.76],
    zoom: 10,
  })
}

onMounted(initMap)
</script>
<template>
  <div id="map" class="w-full h-full"></div>
</template>

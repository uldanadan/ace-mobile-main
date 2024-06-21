<route lang="json">
{
  "meta": {
    "title": "Locations",
    "requiresAuth": false
  }
}
</route>

<script lang="ts" setup>
import { onMounted } from 'vue'

import { useLocationsStore } from '../../stores'

import type { ICurrentPosition } from '../../types/locations'

const store = useLocationsStore()

const currentPosition = computed<ICurrentPosition>(() => store.currentPosition)

// onMounted(() => {
// store.fetchFriendsLocations()
// store.fetchGameCentersLocations()
// store.getCurrentPosition()
// store.watchCurrentPosition()
// store.watchCurrentPositionCapacitor()
// store.getCurrentPositionCapacitor()
// store.geolocationCheckPermission()
// })

// onUnmounted(() => {
// store.clearGeolocationWatchersCapacitor()
// })
</script>
<template>
  <div class="relative unselectable">
    <MapDG :current-position="currentPosition" :zoom="13" />
    <!-- <MapGL /> -->
  </div>
</template>
<style>
.unselectable {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>

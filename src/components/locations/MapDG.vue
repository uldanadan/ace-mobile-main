<script lang="ts" setup>
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import DG from '2gis-maps'

import IconPerson from './icons/person-marker.svg?url'
import IconFriend from './icons/friend-marker.svg?url'
import GameIcon from '../../assets/icons/game_outline_28.svg?url'

import QrIcon from '../../assets/icons/qr_code_outline_28.svg?url'

import { useLocationsStore, useAccountStore } from '../../stores'

import type { ICurrentPosition, IFriendLocation, IGameCenterLocation } from '../../types/locations'

import JSConfetti from 'js-confetti'

const router = useRouter()
const store = useLocationsStore()
const accountStore = useAccountStore()

const geoPermissionGrantedStatus = computed<'' | 'granted' | 'prompt' | 'denied'>(() => store.geoPermissionGrantedStatus)
const currentPosition = computed<ICurrentPosition>(() => store.currentPosition)
const currentPositionUpdated = computed(() => store.currentPositionUpdated)
const getFriendsLocations = computed<IFriendLocation[]>(() => store.friendsLocations)
const gameCentersLocations = computed<IGameCenterLocation[]>(() => store.gameCentersLocations)
const friendsLocationsOld = ref<IFriendLocation[]>()

const userUUID = computed<string>(() => accountStore.user.uuid)

// const DG = await require('2gis-maps')
const props = defineProps<{
  center?: [number, number]
  zoom?: number
}>()

const userImage = 'https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj'

const map = ref<any>()
const selfMarker = ref<any>()
const friendsMarkers = ref<any>({})
const featureGroup = ref<any>()
const gameCentersMarkers = ref<any>({})

const friendsMarkersInterval = ref<any>()

const qrModal = ref(false)
const isPopUpOpen = ref(false)
const activePopUpFriendEmail = ref<string>('')
const activeEmoji = ref<string>('')

const canvas: HTMLCanvasElement | undefined = document.getElementById('js-confetti-canvas-id') as HTMLCanvasElement | undefined
const confetti = new JSConfetti({ canvas })

const getIsOnline = (lastSeen: string) => {
  const lastSeenDate = new Date(lastSeen)
  const now = new Date()
  const diff = now.getTime() - lastSeenDate.getTime()
  const diffInMinutes = Math.round(diff / 60000)
  // TODO: добавить минут\часов\дней назад
  return diffInMinutes < 10
}

const initMap = async () => {
  DG.then(function () {
    map.value = DG.map('map', {
      center: props.center && props.center.length > 0 ? props.center : [43.2269544, 76.8612008],
      zoom: props.zoom,
      fullscreenControl: false,
      zoomControl: false, // TODO: remove trash markers
      doubleClickZoom: false,
      maxZoom: 18,
    })
  })

  // const myDivIcon = DG.divIcon({
  //   className: 'alo',
  //   iconSize: [64, 64],
  //   html: `<div class="relative w-[64px] h-[64px]"><img class="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[64px] h-[64px]" src="${IconPerson}" /><img class="absolute -top-1/3 left-1/2 -translate-x-1/2 rounded-full object-fit max-w-[32px] max-h-[32px]" src="${userImage}" /></div>`,
  // })

  // DG.marker([43.2045763, 76.9129642], { icon: myDivIcon }).addTo(map.value)
}

const addSelfMarker = (currPosition: ICurrentPosition) => {
  if (selfMarker.value) {
    map.value.removeLayer(selfMarker.value)
  }
  if (!map.value) {
    return
  }
  console.log('selfMarker')

  const myDivIcon = DG.divIcon({
    className: 'self-marker',
    iconSize: [64, 64],
    html: `<div class="relative w-[64px] h-[64px]"><img class="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[64px] h-[64px]" src="${IconPerson}" /></div>`,
  })

  selfMarker.value = DG.marker([currPosition.lat, currPosition.long], { icon: myDivIcon }).addTo(map.value)
}

const addFriendMarker = (pos: IFriendLocation) => {
  const myDivIcon = DG.divIcon({
    className: 'friend-marker',
    iconSize: [64, 64],
    html: `
    <div class="relative w-[64px] h-[64px]">
      <span class="absolute -top-[75%] left-1/2 -translate-x-1/2 px-1 rounded-full ${getIsOnline(pos.location.created_at) ? 'bg-white' : 'bg-white'} ">${
      getIsOnline(pos.location.created_at) ? 'online' : 'offline'
    }</span>
      <img class="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[64px] h-[64px]" src="${IconFriend}" />
      ${pos.image ? `<img class="absolute -top-[45%] left-1/2 -translate-x-1/2 rounded-full object-fit w-[42px] h-[42px]" src="${pos.image}" />` : ``}
    </div>`,
  })

  friendsMarkers.value = {
    ...friendsMarkers.value,
    [pos.email]: DG.marker([pos.location.latitude, pos.location.longitude], { icon: myDivIcon })
      .addTo(map.value)
      .bindPopup(
        `<div class="flex flex-col items-center justify-center">
          <img class="rounded-full object-fit w-[64px] h-[64px] min-w-[64px]" src="${pos.image}" />
          <span class="friendEmail text-xs">${pos.email.length > 22 ? pos.email.slice(0, 16) + '...' : pos.email}</span>
        </div>`
      )
      .on('click', function (e: any) {
        // get element by class frinedEmail
        isPopUpOpen.value = true
        activePopUpFriendEmail.value = e.target._popup._contentNode.querySelector('.friendEmail').innerHTML
        const popup = e.target._popup
        popup.on('remove', function () {
          isPopUpOpen.value = false
        })
      }),
  }
}

const addGameCenterMarker = (pos: IGameCenterLocation) => {
  if (!pos.latitude || !pos.longitude) return
  if (gameCentersMarkers.value[pos.uuid]) return
  const myDivIcon = DG.divIcon({
    className: 'game-center-marker',
    iconSize: [64, 64],
    html: `
    <div class="relative w-[64px] h-[64px]">
      <div class="absolute flex items-center justify-center -top-1/2 left-1/2 -translate-x-1/2 w-[36px] aspect-1 rounded-full">
        <img class="w-[30px] h-[30px]" src="${pos.logo}" />
      </div>
      <p class="whitespace-nowrap text-md absolute top-[5%] left-1/2 -translate-x-1/2 text-black">${pos.name}</p>
    </div>`,
  })

  gameCentersMarkers.value = {
    ...gameCentersMarkers.value,
    [pos.uuid]: DG.marker([pos.latitude, pos.longitude], { icon: myDivIcon })
      .on('click', function () {
        router.push(`/clubs/${pos.uuid}`)
      })
      .addTo(map.value),
    // .on('click', function (e: any) {
    //   // listen click on popup
    //   console.log('alo', e.type)

    //   const clubId = e.target._popup._contentNode.querySelector('.clubId').innerHTML
    //   if (oldActiveClub.value === clubId) {
    //     oldActiveClub.value = ''
    //     router.push(`/clubs/${clubId}`)
    //   } else {
    //     oldActiveClub.value = clubId
    //   }
    // }),
  }
}

const fitBounds = () => {
  if (!featureGroup.value) return
  if (!map.value) return

  const bounds = featureGroup.value.getBounds()
  // fit bounds with padding
  map.value.fitBounds(bounds.pad(0.3))
}

const moveSelfMarker = (currPosition: ICurrentPosition) => {
  if (selfMarker.value) {
    selfMarker.value.setLatLng([currPosition.lat, currPosition.long])
  }
}

const moveFriendsMarker = (pos: IFriendLocation) => {
  const friendMarker = friendsMarkers.value[pos.email as keyof typeof friendsMarkers.value]
  if (friendMarker) {
    friendMarker.setLatLng([pos.location.latitude, pos.location.longitude])
  }
}

const moveWithAnimationFriendsMarker = (oldPos: IFriendLocation, newPos: IFriendLocation) => {
  const friendMarker = friendsMarkers.value[oldPos.email as keyof typeof friendsMarkers.value]

  if (friendMarker) {
    const oldLatLng = {
      lat: oldPos.location.latitude,
      lng: oldPos.location.longitude,
    }
    const newLatLng = {
      lat: newPos.location.latitude,
      lng: newPos.location.longitude,
    }

    const latDiff = newLatLng.lat - oldLatLng.lat
    const longDiff = newLatLng.lng - oldLatLng.lng

    const stepLat = latDiff / 10
    const stepLong = longDiff / 10

    let i = 0
    const interval = setInterval(() => {
      friendMarker.setLatLng([oldLatLng.lat + stepLat * i, oldLatLng.lng + stepLong * i])
      i++
      if (i === 10) {
        clearInterval(interval)
      }
    }, 100)
  }
}

const updateFriendsMarkers = () => {
  getFriendsLocations.value.forEach((pos) => {
    if (friendsLocationsOld.value) {
      const oldPos = friendsLocationsOld.value.find((i) => i.email === pos.email)
      if (oldPos && 'location' in oldPos && oldPos.location && 'latitude' in oldPos.location && 'longitude' in oldPos.location && 'created_at' in oldPos.location) {
        if (getIsOnline(oldPos.location.created_at) !== getIsOnline(pos.location.created_at)) {
          console.log('online changed')

          friendsMarkers.value[pos.email as keyof typeof friendsMarkers.value].setIcon(
            DG.divIcon({
              className: 'friend-marker',
              iconSize: [64, 64],
              html: `
    <div class="relative w-[64px] h-[64px]">
      <span class="absolute -top-[75%] left-1/2 -translate-x-1/2 px-1 rounded-full ${getIsOnline(pos.location.created_at) ? 'bg-white' : 'bg-white'} ">${
                getIsOnline(pos.location.created_at) ? 'online' : 'offline'
              }</span>
      <img class="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[64px] h-[64px]" src="${IconFriend}" />
      ${pos.image ? `<img class="absolute -top-[45%] left-1/2 -translate-x-1/2 rounded-full object-fit w-[42px] h-[42px]" src="${pos.image}" />` : ``}
    </div>`,
            })
          )
          moveFriendsMarker(pos)
        } else {
          console.log('moveWithAnimationFriendsMarker')

          moveWithAnimationFriendsMarker(oldPos, pos)
        }
      }
    } else {
      console.log('addFriendMarker')
      if ('location' in pos && pos.location && 'latitude' in pos.location && 'longitude' in pos.location && 'created_at' in pos.location) {
        addFriendMarker(pos)
      }
    }
  })
}

const moveMapToCurrentPosition = (pos: ICurrentPosition) => {
  if (!map.value) return
  console.log('moveMapToCurrentPosition', pos)

  map.value.setView([pos.lat, pos.long])
}

const requestPermission = () => {
  store.geolocationRequestPermission()

  // store.getCurrentPosition()
  // store.watchCurrentPositionCapacitor()
  // initFirstPosition()
  // router.push('/locations')
  // window.location.reload()
}

const handleShowQRModal = () => {
  qrModal.value = !qrModal.value
}

const handleShowConfetti = (emoji: string) => {
  confetti.addConfetti({
    emojis: [emoji],
    emojiSize: 100,
  })
}

onMounted(() => {
  initMap()

  store.getCurrentPositionCapacitor().then(() => {
    if (currentPosition.value.lat && currentPosition.value.long) {
      if (selfMarker.value) {
        moveSelfMarker(currentPosition.value)
      } else {
        console.log('pre addSelfMarker')

        addSelfMarker(currentPosition.value)
      }
      moveMapToCurrentPosition(currentPosition.value)
      store.postLocation()
    }
  })
  console.log('selfmarker', selfMarker.value)

  if (currentPosition.value.lat && currentPosition.value.long) {
    if (selfMarker.value) {
      moveSelfMarker(currentPosition.value)
    } else {
      console.log('pre addSelfMarker')

      addSelfMarker(currentPosition.value)
    }
    moveMapToCurrentPosition(currentPosition.value)
    store.postLocation()
  }
  store.fetchFriendsLocations().then(() => {
    if (getFriendsLocations.value.length > 0) {
      updateFriendsMarkers()
      friendsMarkersInterval.value = setInterval(() => {
        store.getCurrentPositionCapacitor().then(() => {
          if (selfMarker.value) {
            moveSelfMarker(currentPosition.value)
          } else {
            addSelfMarker(currentPosition.value)
          }
          store.postLocation()
        })

        friendsLocationsOld.value = getFriendsLocations.value
        store.fetchFriendsLocations().then(() => {
          updateFriendsMarkers()
        })
        store.postLocation()
      }, 15000)
      try {
        if (featureGroup.value) {
          featureGroup.value.clearLayers()
        }
        if (friendsMarkers.value && selfMarker.value) {
          featureGroup.value = DG.featureGroup([...Object.values(friendsMarkers.value), selfMarker.value]).addTo(map.value)
        }
        // fitBounds()
      } catch (error) {
        console.log(error)
      }
    }
  })

  store.fetchGameCentersLocations().then(() => {
    if (gameCentersLocations.value.length > 0) {
      gameCentersLocations.value.forEach((pos) => {
        addGameCenterMarker(pos)
      })
    }
  })

  store.geolocationCheckPermission()
})

onUnmounted(() => {
  // remove map from memory
  // remove map from DOM
  // remove map from store
  // remove layers from map
  // remove markers from map

  map.value.removeLayer(featureGroup.value)
  featureGroup.value = null

  // remove markers from map
  Object.values(friendsMarkers.value).forEach((marker: any) => {
    marker.remove()
  })

  Object.values(gameCentersMarkers.value).forEach((marker: any) => {
    marker.remove()
  })

  selfMarker.value.remove()
  map.value.remove()

  map.value = null
  selfMarker.value = null
  friendsMarkers.value = null
  clearInterval(friendsMarkersInterval.value)
  friendsMarkersInterval.value = null
  friendsLocationsOld.value = undefined
  gameCentersMarkers.value = null
})

// TODO: переписать вотчи на функции

// watch(currentPositionUpdated, () => {
//   if (currentPosition.value.lat && currentPosition.value.long) {
//     moveSelfMarker(currentPosition.value)
//   }
// })
</script>
<template>
  <div class="relative">
    <div class="flex items-center absolute right-2 pt-safe top-2 z-20">
      <!-- <div class="bg-white p-1">
        <p class="text-xs">lat:{{ currentPosition.lat }}</p>
        <p class="text-xs">lat:{{ currentPosition.long }}</p>
      </div> -->
      <div class="bg-white rounded-md p-1" @click="handleShowQRModal">
        <img :src="QrIcon" class="h-8 w-8" />
      </div>
    </div>
    <div v-show="qrModal" class="duration-300 absolute top-0 left-0 z-30 w-full h-full bg-black/20" @click="handleShowQRModal">
      <div class="flex flex-col p-4 bg-white rounded-xl items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
        <QRcode :value="`friend ${userUUID}`" :size="250" />
        <h1 class="text-lg font-semibold mt-4">Покажите QR другу</h1>
      </div>
    </div>
    <!-- <LocPermitionDialog v-if="!['granted'].includes(geoPermissionGrantedStatus)" @confirm="requestPermission" /> -->
    <!-- <div v-if="currentPosition.lat" class="flex items-center absolute left-4 bottom-12 z-10">
      <div class="bg-white rounded-md p-1" @click="moveMapToCurrentPosition(currentPosition)">
        <IconCurrentLocation class="h-8 w-8" />
      </div>
      <div class="ml-2 bg-white rounded-md p-1" @click="fitBounds">
        <IconFriends class="h-8 w-8" />
      </div>
    </div> -->
    <div v-if="isPopUpOpen" class="flex w-full items-center justify-center absolute left-0 bottom-12 z-10">
      <EmojiBar @emoji="handleShowConfetti" />
    </div>
    <div id="map" class=""></div>
  </div>
</template>
<style>
html,
body,
#map {
  height: 100vh;
  width: 100%;
}
</style>

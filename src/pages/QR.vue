<route lang="json">
{
  "meta": {
    "title": "QR",
    "requiresAuth": true
  }
}
</route>

<script setup>
import { onDeactivated } from 'vue'

import IcRoundQrCode from '../components/icons/IcRoundQrCode.vue'
import IcRoundLogOut from '../components/icons/IcRoundLogOut.vue'
import SimpleButton from '../components/SimpleButton.vue'

import ArrowIcon from '../assets/icons/chevron_back_28.svg?url'

import { useAccountStore, useLocationsStore } from '../stores'

import { QrStream } from 'vue3-qr-reader'
import { Capacitor } from '@capacitor/core'
import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner'

const router = useRouter()
const store = useAccountStore()
const locationStore = useLocationsStore()

const showQRScanner = ref(false)

showQRScanner.value = true
// Capacitor.getPlatform() === 'web' && (showQRScanner.value = true)

const onDecode = (result) => {
  if (result) {
    if (result.split(' ')[0] === 'balance') {
      store.setQrBalanceData(result)
      router.push('/balance/addBalance')
    } else if (result.split(' ')[0] === 'friend') {
      locationStore.addAFriendViaQR(result.split(' ')[1]).then((res) => {
        if (res === 'success') {
          router.push('/success')
        }
      })
    } else {
      const computerId = result.split('computer_id=')[1].split('&')[0]
      const computerTime = result.split('computer_id=')[1].split('computer_time=')[1]
      store
        .authLoginQR(computerId, computerTime)
        .then((res) => {
          router.push(`/success`)
        })
        .catch((error) => {
          router.push('/')
        })
    }
  }
}

onMounted(() => {
  store.setComputerId('')
  store.setComputerTime('')
  if (!store.getToken.length) {
    router.push(`/auth`)
  } else {
    startScan()
  }
})

onBeforeUnmount(() => {
  stopScan()
})

onDeactivated(() => {
  stopScan()
})

const logout = () => {
  store.setToken('')
  router.push(`/auth`)
}

const goToIndex = () => {
  router.push(`/`)
}

const startScan = async () => {
  await didUserGrantPermission()

  // BarcodeScanner.hideBackground()
  // document.body.classList.add('qrscanner')
  // const result = await BarcodeScanner.startScan({ targetedFormats: [SupportedFormat.QR_CODE] });
  const result = await BarcodeScanner.startScan()
  // document.body.classList.remove('qrscanner')

  if (result.hasContent) {
    if (result.content.split(' ')[0] === 'balance') {
      store.setQrBalanceData(result.content)
      router.push('/balance/addBalance')
    } else {
      const computerId = result.content.split('computer_id=')[1].split('&')[0]
      const computerTime = result.content.split('computer_id=')[1].split('computer_time=')[1]
      store.authLoginQR(computerId, computerTime)
      router.push(`/success`)
    }
    // router.push(`/?computer_id=${computerId}&computer_time=${computerTime}`);
  }
}

const stopScan = async () => {
  BarcodeScanner.showBackground()
  // document.body.classList.remove('qrscanner')
  await BarcodeScanner.stopScan()
}

const didUserGrantPermission = async () => {
  if (Capacitor.getPlatform() != 'web') {
    const status = await BarcodeScanner.checkPermission({ force: false })

    if (status.granted) {
      return true
    }

    if (status.denied) {
      return false
    }

    if (status.neverAsked) {
      const c = confirm('Нам нужно ваше разрешение для сканирования QR кодов')
      if (!c) {
        return false
      }
    }

    if (status.restricted || status.unknown) {
      return false
    }

    const statusRequest = await BarcodeScanner.checkPermission({ force: true })

    if (statusRequest.granted) {
      return true
    }
  }
  return false
}
</script>
<template>
  <div class="max-w-md w-full h-full relative">
    <!-- <PlayUntilModal /> -->
    <!-- <div class="z-[10] flex flex-col items-center absolute left-0 top-0 w-full h-full">
                                                                        <div class="bg-white w-full h-[150px]"></div>
                                                                        <div class="flex">
                                                                          <div class="h-full w-[50px] bg-white"></div>
                                                                          <div class="bg-transparent w-[300px] h-[300px]">
                                                                          </div>
                                                                          <div class="h-full w-[50px] bg-white"></div>
                                                                        </div>
                                                                        <div class="bg-white w-full h-[450px]"></div>
                                                                      </div> -->
    <div>
      <button
        class="absolute flex items-center whitespace-nowrap z-10 bg-white top-[80%] pr-10 pl-6 py-4 rounded-2xl text-violet-800 uppercase left-1/2 -translate-x-1/2 "
        @click="goToIndex">
        <img :src="ArrowIcon" alt="" height="24" width="24" style="width: 23px" />
        <span class="ml-4">На главную</span>
      </button>

    </div>
    <div v-if="showQRScanner" class="bg-gray-50 w-full h-full">
      <qr-stream @decode="onDecode"></qr-stream>
    </div>
  </div>
</template>

<route lang="json">
{
  "meta": {
    "title": "Add Balance",
    "requiresAuth": true
  }
}
</route>

<template>
  <div class="h-full flex flex-col pt-header-safe items-center justify-start px-4 sm:px-6 lg:px-8 bg-white">
    <div class="max-w-md w-full">
      <img draggable="false" class="mx-auto my-4 h-[120px] w-auto" src="/logo/just_icon.png" alt="AceLogo" />
      <h2 class="text-center text-xl font-extrabold text-gray-900">Пополнение баланса</h2>
      <form class="mt-2" @submit.prevent="submitAddBalance">
        <div class="rounded-md shadow-sm -space-y-px">
          <div class="flex flex-col gap-y-2">
            <label for="user-email" class="sr-only">Email</label>
            <input id="user-email" name="user-email" type="email" v-model="userEmailData" readonly
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Почта пользователя" />
            <label for="balance-transaction" class="sr-only">Сумма</label>
            <input id="balance-transaction" name="balance-transaction" type="number" pattern="[0-9]*" inputmode="numeric"
              v-model="balanceTransaction" required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Сумма транзакции" />
          </div>
        </div>

        <div>
          <primary-button :disabled="loading" type="submit">Подтвердить</primary-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAccountStore } from '../../stores'

const accountStore = useAccountStore()

const router = useRouter()

const balanceQrData = computed(() => accountStore.qrBalanceData)
const userUuidData = computed(() => balanceQrData.value.split(' ')[1])
const userEmailData = computed(() => balanceQrData.value.split(' ')[2])
const balanceTransaction = ref()

const loading = ref(false)

const submitAddBalance = () => {
  loading.value = true
  accountStore
    .addUserBalance(balanceTransaction.value, userUuidData.value)
    .then(() => {
      router.push('/success')
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

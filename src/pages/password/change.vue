<route lang="json">
{
  "meta": {
    "title": "Change"
  }
}
</route>

<script setup>
import { formatErrors } from '@/utils/formatErrors'

import PrimaryButton from '@/components/PrimaryButton.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import { useAccountStore } from '../../stores'

const router = useRouter()
const store = useAccountStore()

const isError = ref(true)
const errorMessage = ref('')

const oldPassword = ref(null)
const newPassword = ref(null)

const handleSubmit = () => {
  store
    .changeUserPassword(oldPassword.value, newPassword.value)
    .then(() => {
      router.push('/')
    })
    .catch((err) => {
      isError.value = true
      errorMessage.value = formatErrors(store.error.response.data)
    })
}
</script>
<template>
  <div class="h-full pt-header-safe flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8 bg-white">
    <div class="max-w-md w-full">
      <img draggable="false" class="mx-auto h-[120px] my-4 w-auto" src="/logo/just_icon.png" alt="AceLogo" />
      <h2 class="text-center text-xl font-extrabold text-gray-900">Изменение пароля</h2>
      <div>
        <ErrorMessage :is-error="isError" :message="errorMessage" />
      </div>
      <form class="mt-2" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div class="flex flex-col gap-y-2">
            <label for="old-password" class="sr-only">Old password</label>
            <input id="old-password" name="old-password" type="password" v-model="oldPassword" required
              autocomplete="new-password"
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Old password" />
            <label for="new-password" class="sr-only">New password</label>
            <input id="new-password" name="new-password" type="password" v-model="newPassword" required
              autocomplete="new-password"
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="New password" />
          </div>
        </div>

        <div>
          <primary-button type="submit">Подтвердить</primary-button>
        </div>
      </form>
    </div>
  </div>
</template>

<route lang="json">
{
  "meta": {
    "title": "Forgot"
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

const email = ref(null)

const handleSubmit = () => {
  store
    .authPasswordReset(email.value)
    .then(() => {
      router.push('/auth')
    })
    .catch((err) => {
      isError.value = true
      errorMessage.value = formatErrors(err.response.data)
    })
}
</script>
<template>
  <div class="h-full pt-header-safe flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8 bg-white">
    <div class="max-w-md w-full">
      <img draggable="false" class="mx-auto my-4 h-[120px] w-auto" src="/logo/just_icon.png" alt="AceLogo" />
      <h2 class="text-center text-xl font-extrabold text-gray-900">Восстановление пароля</h2>
      <div>
        <ErrorMessage :is-error="isError" :message="errorMessage" />
      </div>
      <form class="mt-2" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input id="email-address" name="email" type="email" v-model="email" autocomplete="email" required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email" />
          </div>
        </div>

        <div>
          <primary-button type="submit">Подтвердить</primary-button>
        </div>
      </form>
    </div>
  </div>
</template>

<route lang="json">
{
  "meta": {
    "title": "Register",
    "requiresAuth": false
  }
}
</route>

<script setup>
import { formatErrors } from '@/utils/formatErrors'
import { useAccountStore } from '../stores'

import PrimaryButton from '@/components/PrimaryButton.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'

const router = useRouter()
const store = useAccountStore()

const isError = ref(true)
const errorMessage = ref('')

const email = ref(null)
const password = ref(null)

const register = () => {
  store
    .authRegister(email.value, password.value)
    .then(() => {
      errorMessage.value = 'Пользователь успешно зарегистрирован'
      isError.value = false
      router.push('/')
    })
    .catch((err) => {
      isError.value = true
      errorMessage.value = formatErrors(store.errorData.response.data)
    })
}
</script>
<template>
  <div class="min-h-[90vh] flex flex-col pt-header-safe items-center justify-start px-4 sm:px-6 lg:px-8 bg-white">
    <div class="max-w-md w-full">
      <div>
        <img src="/logo/just_icon.png" draggable="false" class="mx-auto my-4 h-[120px] w-auto" />
        <h2 class="text-center text-xl font-extrabold text-gray-900">Создание аккаунта</h2>
      </div>
      <form class="my-4" @submit.prevent="register">
        <div class="flex flex-col gap-y-4">
          <div class="relative">
            <label for="email-address" class="sr-only">Email address</label>
            <input id="email-address" name="email" type="email" v-model="email" autocomplete="email" required
              class="appearance-none z-10 indent-7 relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email" />
            <IconEmail class="absolute z-20 left-4 top-1/2 -translate-y-1/2" />
          </div>
          <div class="relative">
            <label for="password" class="sr-only">Password</label>
            <input id="password" name="password" type="password" v-model="password" autocomplete="current-password"
              required
              class="appearance-none z-10 indent-7 relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Пароль" />
            <IconEye class="absolute z-20 left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>
        <div>
          <ErrorMessage :is-error="isError" :message="errorMessage" />
        </div>
        <div>
          <primary-button type="submit">Подтвердить</primary-button>
        </div>
      </form>
    </div>
  </div>
</template>

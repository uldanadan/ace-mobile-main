<route lang="json">
{
  "meta": {
    "title": "Profile",
    "requiresAuth": true
  }
}
</route>

<template>
  <div>
    <!-- <Header></Header> -->
    <div v-if="loading" class="pt-header-safe flex h-[80vh] items-center justify-center">
      <img class="animate-spin" :src="LoadingIcon" alt="" />
    </div>
    <div v-else class="pt-header-safe flex h-full flex-col items-center gap-y-10">
      <div class="flex flex-col gap-y-3 pt-3">
        <div class="flex h-40 w-40 items-center justify-center rounded-[50%] bg-[#f9fafb] bg-cover bg-center bg-no-repeat"
          :style="{
            'background-image': `url(${imageUser?.length > 0 ? imageUser : UserICon})`,
          }"></div>
        <input id="choosePhoto" type="file" accept="image/*"
          class="absolute z-[-1] h-[0.1px] w-[0.1px] overflow-hidden opacity-0" @change="uploadPhoto" />
        <label for="choosePhoto" class="cursor-pointer text-center text-base font-semibold text-[#9475ed]">Изменить
          фото</label>
      </div>
      <div class="flex h-full w-full flex-col items-center justify-start gap-9 px-4">
        <form @submit.prevent="changeDataUser" id="profile-info"
          class="flex w-full flex-col rounded-2xl bg-[#fafafa] px-4">
          <input type="text" placeholder="Имя" v-model="nameUser"
            class="border-none bg-transparent py-4 px-0 text-base font-normal outline-none" />
          <input type="text" placeholder="Фамилия" v-model="lastNameUser"
            class="border-none bg-transparent py-4 px-0 text-base font-normal outline-none" />
        </form>
        <div class="flex w-full flex-col rounded-2xl bg-[#fafafa] px-4">
          <input type="text" :value="emailUser" readonly
            class="border-none bg-transparent py-4 px-0 text-base font-normal outline-none" />
          <router-link to="/password/change">
            <div class="flex justify-between border-none bg-transparent py-4 px-0 text-base font-normal outline-none">
              <div class="flex items-center justify-center">
                <span v-for="i in 8">&#8226;</span>
              </div>
              <div class="flex items-center">
                <div>Сменить пароль</div>
                <img :src="ArrowIcon" alt="" class="rotate-180" width="20" height="20" />
              </div>
            </div>
          </router-link>
        </div>
        <div class="flex w-full justify-center">
          <button @click="deleteConfirmModal = true" type="button"
            class="w-[90%] bg-transparent py-[13px] text-center text-base leading-[22px] text-[#7a7a7a]">Удалить
            аккаунт</button>
        </div>
      </div>
      <button @click="logout" type="button"
        class="fixed bottom-6 w-[90%] bg-transparent py-[13px] text-center text-base font-semibold leading-[22px] text-[#7a7a7a]">Выйти</button>

      <div v-if="deleteConfirmModal" class="h-full w-full">
        <div class="fixed inset-0 z-50 bg-black bg-opacity-50"></div>
        <div class="fixed inset-0 z-50 flex items-center justify-center">
          <div
            class="flex h-[200px] w-[90%] max-w-[400px] flex-col justify-between gap-y-5 rounded-2xl bg-white px-4 py-6">
            <div class="text-center text-base font-semibold">Вы уверены, что хотите удалить аккаунт?</div>
            <div class="flex justify-center gap-x-4">
              <button @click="deleteConfirmModal = false" type="button"
                class="w-[90%] bg-transparent py-[13px] text-center text-base font-semibold leading-[22px] text-[#7a7a7a]">Отмена</button>
              <button @click="deleteAccount" type="button"
                class="w-[90%] bg-transparent py-[13px] text-center text-base font-semibold leading-[22px] text-[#7a7a7a]">Удалить</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { apiClientAccount } from '../http-common'
import ArrowIcon from '../assets/icons/arrow-icon.svg?url'
import UserICon from '../assets/icons/avatar-icon.svg?url'

import LoadingIcon from '../assets/icons/loading.svg?url'

import { useAccountStore } from '../stores'
import { User } from '../models/index'
const store = useAccountStore()
const router = useRouter()

const deleteConfirmModal = ref(false)
const logout = () => {
  store.logoutUser()
  router.push(`/`)
}
const deleteAccount = () => {
  store.deleteAccount()
  deleteConfirmModal.value = false
  router.push(`/`)
}
const nameUser = ref('')
const lastNameUser = ref('')
const emailUser = ref('')
const imageUser = ref()

const loading = ref(false)
const changeDataUser = () => {
  store.changeUserData(nameUser.value, lastNameUser.value).then(() => {
    router.push('/')
  })
}
onMounted(async () => {
  loading.value = true
  await apiClientAccount
    .get('/accounts/me/')
    .then((response) => {
      return User.serialize(response.data)
    })
    .then((user) => {
      nameUser.value = user.firstName
      lastNameUser.value = user.lastName
      emailUser.value = user.email
      imageUser.value = user.image
      loading.value = false
    })
    .catch()
})
const uploadPhoto = async function () {
  const photoInput = (document.getElementById('choosePhoto') as HTMLInputElement) || null
  const avatar = photoInput.files![0]
  let formPhoto = new FormData()
  formPhoto.set('image', avatar)
  await apiClientAccount
    .patch('accounts/me/', formPhoto)
    .then((res) => console.log('hi'))
    .catch((error) => {
      console.log(error)
      throw new Error(String(error))
    })
}
</script>
<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  appearance: none;
  -webkit-appearance: none;
  margin: 0;
}

input[type='text'] {
  appearance: textfield;
  -moz-appearance: textfield;
}

input[type='text']:first-child {
  border-bottom: 1px solid #ffffff;
}

input[type='text']:focus {
  outline-style: none;
  box-shadow: none;
  border-color: transparent;
}
</style>

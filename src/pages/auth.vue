<route lang="json">
{
	"meta": {
		"title": "Auth"
	}
}
</route>

<script setup lang="ts">
import { Device } from "@capacitor/device"
import LoadingIcon from "../assets/icons/loading-white.svg?url"
import { formatErrors } from "../utils/formatErrors"
import { useAccountStore } from "../stores"

import PrimaryButton from "@/components/PrimaryButton.vue"
import ErrorMessage from "@/components/ErrorMessage.vue"

const router = useRouter()
const store = useAccountStore()

const token = computed(() => store.getToken)
const isForgotPassword = computed(() => store.getForgotPassword)
const errorData = computed(() => store.error)
const loading = computed(() => store.getLoading)

const isError = ref(false)
const errorMessage = ref("")

const email = ref(null)
const password = ref(null)

const login = async () => {
	if (!email.value || !password.value) {
		isError.value = true
		errorMessage.value = "Заполните все поля"
		return
	}
	store
		.authLogin(email.value, password.value)
		.then(() => {
			router.push(store.nextRoute).then(() => {
				router.push("/")
			})
		})
		.catch(() => {
			isError.value = true
			errorMessage.value = formatErrors(errorData!.value!["data"])
		})
}

const guestMode = async () => {
	const info = await Device.getId()
	if ("uuid" in info && info.uuid) {
		const email = info.uuid.toString() + "@theace.tech"
		const password = info.uuid.toString()

		store
			.authRegister(email, password)
			.then(() => {
				errorMessage.value = "Пользователь успешно зарегистрирован"
				isError.value = false
				router.push("/")
			})
			.catch(err => {
				isError.value = true
				if ((store.errorData.response.data.email = "Could not create account with this email.")) {
					store
						.authLogin(email, password)
						.then(() => {
							router.push("/")
						})
						.catch(() => {
							isError.value = true
							errorMessage.value = formatErrors(errorData!.value!["data"])
						})
				}
			})
	}
}

onMounted(() => {
	if (isForgotPassword.value) {
		isError.value = false
		errorMessage.value = "Вам отправлено письмо с новым паролем"
		setTimeout(() => {
			store.setForgotPassword(false)
		}, 5000)
	}
})
</script>

<template>
	<div class="pt-header-safe flex h-full bg-white px-4 sm:px-6 lg:px-8">
		<div class="w-full max-w-md">
			<div class="p-4">
				<img src="/logo/gaming.png" draggable="false" class="mx-auto h-[180px] w-auto" />
				<!-- <h2 class="text-center text-xl font-extrabold text-gray-900">Требуется авторизация</h2> -->
				<!-- <p class="mt-2 text-center text-sm text-gray-600">
          или
          {{ " " }}
          <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
            воспользуйтесь приложением
          </a>
        </p> -->
			</div>
			<form class="mt-4" @submit.prevent="login">
				<div class="flex flex-col gap-y-4">
					<div class="relative">
						<label for="email-address" class="sr-only">Email address</label>
						<input id="email-address" name="email" type="email" v-model="email" autocomplete="email" required class="relative z-10 block w-full appearance-none rounded-lg border border-gray-300 px-4 py-3 indent-7 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="Email" />
						<IconEmail class="absolute left-4 top-1/2 z-20 -translate-y-1/2" />
					</div>
					<div class="relative">
						<label for="password" class="sr-only">Password</label>
						<input id="password" name="password" type="password" v-model="password" autocomplete="current-password" required class="relative z-10 block w-full appearance-none rounded-lg border border-gray-300 px-4 py-3 indent-7 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="Пароль" />
						<IconEye class="absolute left-4 top-1/2 z-20 -translate-y-1/2" />
					</div>
				</div>

				<div v-if="isError">
					<ErrorMessage :isError="isError" :message="errorMessage" />
				</div>

				<div class="flex items-center justify-between">
					<div class="text-md my-5 font-thin">
						<router-link to="/register" class="font-medium text-black">Регистрация</router-link>
					</div>

					<div class="text-md my-5 font-thin">
						<router-link to="/password/forgot" class="font-medium text-black">Забыли пароль?</router-link>
					</div>
				</div>

				<div class="flex flex-col items-center">
					<primary-button class="mt-0 rounded-lg" type="submit">
						<span v-if="!loading">Войти</span>
						<span v-else class="flex gap-2">
							<img class="animate-spin" :src="LoadingIcon" alt="" />
							Вход...
						</span>
					</primary-button>
				</div>
			</form>
			<div class="flex flex-col items-center">
				<div class="relative my-2 w-full text-center">
					<p class="font-sm relative z-[2] mx-auto my-2 w-fit bg-white px-4 py-2 text-slate-500">или</p>
					<div class="absolute left-0 top-1/2 z-[1] h-[1px] w-full -translate-y-1/2 bg-gray-300"></div>
				</div>
				<button @click="guestMode" class="group relative flex w-full justify-center py-2 text-sm font-semibold text-black">Продолжить как гость</button>
			</div>
		</div>
	</div>
</template>

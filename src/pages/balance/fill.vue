<route lang="json">
{
	"meta": {
		"title": "Fill",
		"requiresAuth": true
	}
}
</route>

<template>
	<div class="pt-header-safe">
		<div class="relative flex h-full flex-col bg-[#ffffff] pt-6">
			<CurrentBalance />

			<!-- <CardsList />
        <div class="w-[90%] mx-auto absolute bottom-0 left-2/4 translate-x-[-50%]">
            <form action="" id="balance-form" class="pb-2 mb-[20px] mx-auto" @submit.prevent="addBalance">
                <input type="number" pattern="[0-9]*" inputmode="numeric" name="balance-val" id="balance-val"
                    placeholder="Введите сумму для пополнения"
                    class="bg-transparent border-none outline-none w-full text-center text-base font-normal" required
                    v-model="paymentAmount">
            </form>
            <button type="submit" form="balance-form"
                class="bg-[#9475ed] rounded-xl text-[#f7f8fc] text-center font-semibold leading-[22px] text-base w-full py-[13px]"
                :class="{ 'opacity-20 touch-none pointer-events-none': !paymentAvailable }">Пополнить</button>
        </div> -->
			<!-- <div v-if="userData && userData.uuid && userData.email" class="m-3 mt-[10vh] flex max-w-full flex-col items-center justify-center px-4">
        <canvas id="canvas"></canvas>
        <QRcode class="max-w-full" :value="`balance ${userData.uuid} ${userData.email}`" />
        <p class="w-[250px] text-center">Покажите QR кассиру для пополнения баланса.</p>
      </div> -->
		</div>
	</div>
</template>

<script setup lang="ts">
import { useAccountStore, usePartnersStore } from "../../stores"
import QRCode from "qrcode"

const router = useRouter()
const store = useAccountStore()

const partnersStore = usePartnersStore()

const page = ref(1)

console.log(store)

onMounted(() => {
	if (!partnersStore.gameCenterList.length) {
		partnersStore.loadGameCenters(page.value)
	}
})

const isCardChosen = computed(() => store.isCardChosen)

const addBalance = () => {
	console.log("add")
}

const paymentAmount = ref()

const paymentAvailable = computed(() => {
	return paymentAmount.value > 0 && isCardChosen.value
})

const userData = computed(() => store.user)

onMounted(() => {
	const canvas = document.getElementById("canvas")
	const dataString = `balance ${userData.value.uuid} ${userData.value.email}`
	QRCode.toCanvas(canvas, dataString, { errorCorrectionLevel: "H", scale: 6 }, function (error: any) {
		if (error) console.error(error)
	})
})

const userDataValue = computed(() => store.user)
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	appearance: none;
	-webkit-appearance: none;
	margin: 0;
}

input[type="number"] {
	appearance: textfield;
	-moz-appearance: textfield;
	border-bottom: 1px solid #e8e8e8;
}

input[type="number"]:focus {
	outline-style: none;
	box-shadow: none;
	border-color: transparent;
	border-bottom: 1px solid #000000;
}
</style>

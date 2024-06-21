<script setup lang="ts">
import { onMounted, ref, computed } from "vue"
import BalanceItem from "@/components/balance/BalanceItem.vue"
import { useAccountStore, usePartnersStore } from "../stores"
import { GameCenter } from "../models"
const partnersStore = usePartnersStore()
const store = useAccountStore()

const page = ref(1)
onMounted(async () => {
	const obj = document.getElementById("balance")
	console.log(store.accountBalance + "THIS IS BALANCE")
	animateValue(obj, 0, store.accountBalance, 500)
	if (!partnersStore.gameCenterList.length) {
		partnersStore.loadGameCenters(page.value)
	}
})

function animateValue(obj: any, start: number, end: number, duration: number) {
	let startTimestamp: number = 0
	const step = (timestamp: number) => {
		if (!startTimestamp) startTimestamp = timestamp
		const progress = Math.min((timestamp - startTimestamp) / duration, 1)
		obj.innerHTML = (progress * (end - start) + start).toFixed(0)
		if (progress < 1) {
			window.requestAnimationFrame(step)
		}
	}
	window.requestAnimationFrame(step)
}

const formatter = new Intl.NumberFormat("ru-KZ", {
	style: "currency",
	currency: "KZT",
	maximumFractionDigits: 0 // (causes 2500.99 to be printed as $2,501)
})
const gameCenterList = computed(() => {
	return GameCenter.serializeList(partnersStore.gameCenterList)
})


</script>

<template>
	<div class="space-y-3 px-3" v-if="gameCenterList.length > 0">
		<BalanceItem v-for="(item, index) in gameCenterList" :key="index" :item="item" />
	</div>
</template>

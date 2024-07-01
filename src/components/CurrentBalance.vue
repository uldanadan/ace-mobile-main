<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import BalanceItem from "@/components/balance/BalanceItem.vue";
import { useAccountStore, usePartnersStore } from "../stores";
import { apiClientAccount } from "../http-common";

const partnersStore = usePartnersStore();
const store = useAccountStore();

const page = ref(1);
const gameCenterList = ref([]);

async function loadBalances() {
	const promises = partnersStore.gameCenterList.map(async (gameCenter) => {
		try {
			const response = await apiClientAccount.get(`/accounts/balance/`, {
				params: {
					page: page.value,
					game_center: gameCenter.uuid,
				},
			});
			if (response.status === 200) {
				return { ...gameCenter, balance: response.data.wallet_amount };
			}
		} catch (error) {
			console.error(`Error loading balance for game center ${gameCenter.uuid}:`, error);
			return null;
		}
	});

	const results = await Promise.all(promises);
	gameCenterList.value = results.filter(result => result !== null);
}

onMounted(async () => {
	if (!partnersStore.gameCenterList.length) {
		await partnersStore.loadGameCenters(page.value);
	}
	await loadBalances();
});

const formatter = new Intl.NumberFormat("ru-KZ", {
	style: "currency",
	currency: "KZT",
	maximumFractionDigits: 0,
});

const noBalances = computed(() => gameCenterList.value.length === 0);
</script>

<template>
	<div class="space-y-3 px-3">
		<div v-if="noBalances" class="text-center text-lg text-brand-gray">
			У вас нет балансов в клубах. Для создания баланса, пожалуйста, авторизуйтесь в компьютерном клубе.
		</div>
		<BalanceItem v-for="(item, index) in gameCenterList" :key="index" :item="item" />
	</div>
</template>

<style scoped></style>

<script setup lang="ts">
import type { ClubInfo } from "../../types/types"
import type { PropType } from "vue"
import { useAccountStore, usePartnersStore } from "../../stores"
import { GameCenter } from "../../models"
import { apiClientAccount } from "../../http-common"
const store = useAccountStore()

const partnersStore = usePartnersStore()

const page = ref(1)

const props = defineProps({
	item: {
		type: Object as PropType<ClubInfo>
	}
})

let gameCenterBalance = ref(0)

async function loadAccountBalance(page: number, gameCenter: string) {
	await apiClientAccount
		.get(`/accounts/balance/`, {
			params: {
				page: page,
				game_center: gameCenter
			}
		})
		.then(response => {
			gameCenterBalance.value = response.data.wallet_amount
			console.log(gameCenterBalance)
		})
		.catch(error => {
			console.error(error)
			throw new Error(String(error))
		})
}

onMounted(async () => {
    if (props.item && props.item.uuid) {
        await loadAccountBalance(page.value, props.item.uuid);
    } else {
        console.error("NO UUID");
    }
});

</script>

<template>
	<router-link :to="`/balance/${item?.uuid}`" v-if="item != null" class="balance flex cursor-pointer items-center justify-between overflow-hidden rounded-lg border px-7 py-5 transition-all duration-300 ease-out hover:shadow-md">
		<div>
			<p class="text-lg font-semibold">{{ item.name }}</p>
			<p class="text-brand-gray">{{ item.address }}</p>
		</div>
		<div>
			<p class="text-xl font-semibold">{{ gameCenterBalance }} ₸</p>
		</div>
	</router-link>
</template>

<style scoped></style>

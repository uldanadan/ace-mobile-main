<script setup lang="ts">
import type { ClubInfo } from "../../types/types"
import type { PropType } from "vue"
import { ref } from "vue"

const props = defineProps({
	item: {
		type: Object as PropType<ClubInfo & { balance: number }>,
	},
})

const gameCenterBalance = ref(props.item.balance);

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

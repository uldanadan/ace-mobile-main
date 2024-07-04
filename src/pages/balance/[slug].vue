<route lang="json">
{
	"meta": {
		"title": "Replenish",
		"requiresAuth": true
	}
}
</route>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { usePartnersStore, useAccountStore } from "../../stores";
import { GameCenter } from "../../models";

import StarIcon from "../../assets/icons/favorite_outline_20.svg?url";
import ClockIcon from "../../assets/icons/clock_outline_20.svg?url";
import QRCode from "qrcode";

interface RouteParams {
	slug: string
}

const partnersStore = usePartnersStore();
const store = useAccountStore();
const route = useRoute();
const page = ref(1);
const club = ref();
const slug = (route.params as RouteParams).slug;

const userData = computed(() => store.user);

const getClub = () => {
	gameCenterList.value.forEach(item => {
		if (item.uuid === slug) {
			club.value = item;
		}
	})
}

const gameCenterList = computed(() => {
	return GameCenter.serializeList(partnersStore.gameCenterList);
})

onMounted(() => {
	if (partnersStore.gameCenterList.length < 1) {
		partnersStore.loadGameCenters(page.value);
	}
	getClub();
	const canvas = document.getElementById("canvas");
	const dataString = `balance ${userData.value.uuid} ${userData.value.email}`
	QRCode.toCanvas(canvas, dataString, { errorCorrectionLevel: "H", scale: 6 }, function (error: any) {
		if (error) console.error(error);
	})
})
</script>

<template>
	<div className="pt-header-safe">
		<div v-if="club != null">
			<div class="p-5">
				<div v-if="userData && userData.uuid && userData.email" class="mb-5 flex w-full items-center justify-center">
					<QRcode class="max-w-full" :value="`balance ${userData.uuid} ${userData.email}`" />
				</div>
				<div class="relative z-20 bg-white">
					<div class="border-y border-brand-line py-5">
						<p class="mb-1 text-2xl font-semibold">{{ club.name }}</p>
						<p class="text-sm text-brand-gray">{{ club.address }}</p>
					</div>
					<div class="mt-5 space-y-3">
						<div class="flex items-center">
							<div class="mr-2">
								<img :src="StarIcon" alt="" />
							</div>
							<p>{{ club.rating }}</p>
						</div>
						<div class="flex items-center">
							<div class="mr-2">
								<img :src="ClockIcon" alt="" />
							</div>
							<p>{{ club.schedule }}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>

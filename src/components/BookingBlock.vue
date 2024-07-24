<template>
	<div class="bottom-0 h-full w-full rounded-t-[15px] bg-[#ffffff] px-[15px]">
		<BookingClubInfo :club-details="clubDetails" />
		<div class="mt-[20px] flex flex-col items-center overflow-y-auto">
			<h2 class="mb-[15px] self-start text-xl font-semibold leading-[25px] text-[#2a2a43]">
				Выберите компьютер
				<span class="ml-auto">({{ getPCBusyCount }})</span>
			</h2>
			<PcCategoryPicker :club-details="clubDetails" :type="'pc'" @update-zone-name="getZoneName" />
			<PcPicker @update-pc-list="writeBookedPc" :zone-name="zoneTitle" @show-loading="showLoading" />
		</div>
		<div id="blur-loading" class="align-center blur_loading pointer-events-none absolute top-0 z-[4] flex hidden h-[100vh] items-center">
			<svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
				<circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
				<path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
			</svg>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { PropType } from "vue"
import type { ClubInfo } from "../types/types"
import { useAccountStore, usePartnersStore } from "../stores"
import { formatRFC3339 } from "date-fns"
import { formatErrors } from "../utils/formatErrors"
import { Pc } from "../models"

const partnersStore = usePartnersStore()
const accountStore = useAccountStore()
const router = useRouter()
const route = useRoute()

const props = defineProps({
	clubDetails: {
		type: Object as PropType<ClubInfo>
	}
})

const zoneTitle = ref()

const pcList = computed(function () {
	return Pc.serializeList(partnersStore.pcList)
})

const getPCBusyCount = computed(() => {
	return `${partnersStore.availablePCs}/${pcList.value.length}`
})

const emit = defineEmits<{
	(e: "error", error: string): string
}>()

const errorData = computed(() => accountStore.error)

const showLoading = () => {
	let blur = document.getElementById("blur-loading") as HTMLElement;
	if (blur) {
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;

		setTimeout(() => {
			blur.remove();
		}, 2500);

		setTimeout(() => {
			router.push("/");
		}, 2500);
	}
}

const bookedPc = ref<Array<any>>([])
const bookedDate = new Date()
const writeBookedPc = async (pcArr: Array<any>, day: number, hour: number, minute: number) => {
	bookedPc.value = pcArr
	bookedDate.setDate(bookedDate.getDate() + day)
	bookedDate.setHours(hour)
	bookedDate.setMinutes(minute)
	const formattedDate = formatRFC3339(bookedDate, { fractionDigits: 3 })
	accountStore.setLoading(true)
	accountStore.setNextRoute(route.fullPath)
	accountStore
		.makeReservation(formattedDate, bookedPc.value, true)
		.then(() => {
			let blur = (document.getElementById("blur-loading") as HTMLElement) || null
			blur?.classList.remove("hidden")
			document.body.scrollTop = 0
			document.documentElement.scrollTop = 0
			setTimeout(() => {
				blur.classList.add("hidden")
			}, 2500)
			setTimeout(() => {
				router.push("/")
			}, 2500)
			accountStore.bookedPc = []
		})
		.catch(err => {
			const modalBack = document.getElementById("alertModalBack")
			document.documentElement.style.overflowY = "hidden"
			modalBack?.classList.remove("hidden")
			modalBack?.classList.add("flex")

			if (errorData.value) {
				emit("error", formatErrors(errorData.value[0]))
			} else {
				emit("error", "Ошибка")
			}
			accountStore.bookedPc = []
		})
}

const getZoneName = (name: any) => {
	zoneTitle.value = name
}
</script>

<style>
.blur_loading {
	width: calc(100vw + 15px);
	left: -15px;
	background: rgba(255, 255, 255, 0.2);
	border-radius: 16px;
	box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
	backdrop-filter: blur(5px);
	-webkit-backdrop-filter: blur(5px);
	border: 1px solid rgba(255, 255, 255, 0.3);
}

.checkmark__circle {
	z-index: 5;
	stroke-dasharray: 166;
	stroke-dashoffset: 166;
	stroke-width: 2;
	stroke-miterlimit: 10;
	stroke: #7ac142;
	fill: none;
	animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark {
	width: 56px;
	height: 56px;
	border-radius: 50%;
	display: block;
	stroke-width: 2;
	stroke: #fff;
	stroke-miterlimit: 10;
	margin: 10% auto;
	box-shadow: inset 0px 0px 0px #7ac142;
	animation: fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;
}

.checkmark__check {
	transform-origin: 50% 50%;
	stroke-dasharray: 48;
	stroke-dashoffset: 48;
	animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
	100% {
		stroke-dashoffset: 0;
	}
}

@keyframes scale {
	0%,
	100% {
		transform: none;
	}

	50% {
		transform: scale3d(1.1, 1.1, 1);
	}
}

@keyframes fill {
	100% {
		box-shadow: inset 0px 0px 0px 30px #7ac142;
	}
}
</style>

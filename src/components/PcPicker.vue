<template>
	<div class="relative mb-[150px] flex h-full w-full flex-col justify-between rounded-[10px] bg-white">
		<div v-if="loadingPartners" class="my-[15px] flex items-center justify-center">
			<img class="animate-spin" :src="LoadingIcon" alt="" />
		</div>
		<div v-else class="relative mx-[15px] my-[15px] gap-5 overflow-x-auto overflow-y-hidden" id="pcElemWrap" :class="{ 'pointer-events-none touch-none': loadingAccount }">
			<label v-for="(pc, pcIdx) in pcList" :key="pcIdx" class="pcElem min-w-9 min-h-9 absolute" ref="pcArr" :id="pc.uuid" :data-x="pc.mapX - 1" :data-y="pc.mapY - 1">
				<!-- :class="{ ['touch-none pointer-events-none']: pc?.isBusy }" -->
				<div class="relative flex h-9 w-9 items-center justify-center rounded-[10px] border-2 border-solid" :class="[!pc?.isBusy ? 'border-[#9475ed]' : 'border-[#c7c7c7]', bookedPc?.uuid === pc.uuid ? 'bg-[#9475ed]' : 'bg-[#ffffff]']">
					<img :src="!pc?.isBusy ? PcIconPurple : PcIconGrey" alt="" width="20" height="20" :class="{ hidden: bookedPc?.uuid === pc.uuid }" />
					<img :src="PcIconWhite" alt="" width="20" height="20" :class="[bookedPc?.uuid === pc.uuid ? 'block' : 'hidden']" />
					<div class="absolute bottom-[-1px] right-[-1px] flex h-4 w-4 items-center justify-center rounded-full bg-[#9475ed] text-[11px] font-medium leading-[13px] text-[#f7f8fc]" :class="{ ['bg-[#c7c7c7]']: pc?.isBusy }">
						{{ pc?.number }}
					</div>
				</div>
				<input type="radio" :id="'pc' + pc?.uuid" class="hidden" :value="pc" v-model="bookedPc" />
			</label>
		</div>
		<swipe-modal v-model="isModal" contents-height="50vh" border-top-radius="15px" id="bookingModal">
			<div class="mt-[30px] flex flex-col items-center pb-[50px]">
				<div class="relative mx-5 mb-14 flex items-center justify-center self-stretch">
					<h3 class="text-xl font-semibold leading-[25px] text-[#1f2025]">Выберите время</h3>
					<button class="absolute right-0 h-6 w-6 border-none bg-transparent outline-none" @click="closeModal">
						<img :src="CloseIcon" alt="" width="18" height="18" />
					</button>
				</div>
				<div class="mb-[30px] flex h-[184px] w-full bg-[#ffffff]">
					<div class="w-1/2">
						<TimeWheel :length="24" :width="140" perspective="right" :setValue="formatDate" @change="writeDayVal" />
					</div>
					<div class="w-1/4">
						<TimeWheel loop :length="24" :width="23" :init-idx="currentHour" @change="writeHourVal" />
					</div>
					<div class="w-1/4">
						<TimeWheel loop :length="60" :width="23" perspective="left" :init-idx="currentMinute" @change="writeMinuteVal" />
					</div>
				</div>
				<button
					@click="bookChosenPc"
					class="h-12 w-[345px] rounded-[10px] bg-[#9475ed] text-center text-base font-medium leading-[19px] text-[#f7f8fc]"
					:class="{
						'pointer-events-none touch-none opacity-60': !validateBookingDate
					}"
				>
					Подтвердить
				</button>
			</div>
		</swipe-modal>
	</div>
	<!-- <button v-if="bookedPc?.uuid" @click="openModal"
        class="w-[340px] mx-auto py-[15px] bg-[#9475ed] text-[#f7f8fc] font-medium text-center text-[16px] rounded-[10px] drop-shadow-[0_0_20px_rgba(0,0,0,0.25)] fixed bottom-6"
        :class="[{ 'touch-none pointer-events-none': loadingAccount }]"><span
            v-if="!loadingAccount">Забронировать</span>
        <span v-else class="flex justify-center items-center gap-2">
            <img class="animate-spin" :src="LoadingIconWhite" alt="">
            Бронирование...
        </span>
    </button> -->
	<div v-if="showCard === 'free'" class="glass fixed bottom-6 mx-[15px] mx-auto flex w-full max-w-[430px] items-center justify-between rounded-[10px] p-4" :class="[{ 'pointer-events-none touch-none': loadingAccount }]">
		<div>
			<p class="mb-1.5 text-sm font-medium">Зона {{ zoneName }}</p>
			<p class="text-sm font-medium">Компьютер №{{ bookedPc?.number }}</p>
		</div>
		<div>
			<button class="rounded-xl bg-[#9475ed] px-2.5 py-1.5 text-center text-sm font-semibold text-[#f7f8fc]" @click="openModal">Забронировать</button>
		</div>
	</div>
	<div v-if="showCard === 'busy' || showCard === 'bookedNbusy'" class="glass fixed bottom-6 mx-[15px] mx-auto flex w-full max-w-[430px] items-center justify-between rounded-[10px] p-4" :class="[{ 'pointer-events-none touch-none': loadingAccount }]">
		<div>
			<p
				class="mb-1.5 max-w-[80%] text-sm font-medium"
				:class="{
					fadeText: bookedPc?.currentSession?.user.length > 22
				}"
			>
				<!-- {{ bookedPc?.currentSession?.user }} -->
				{{ bookedPc?.currentSession?.user.length > 22 ? bookedPc?.currentSession?.user.slice(0, 22) : bookedPc?.currentSession?.user }}
			</p>
			<p class="text-sm font-medium">
				{{ countTimeTillNow(bookedPc?.currentSession?.started_at) }}
			</p>
		</div>
		<div>
			<button v-if="currUser.email === bookedPc.currentSession.user" class="rounded-xl bg-[#9475ed] px-2.5 py-1.5 text-center text-sm font-semibold text-[#f7f8fc]" @click="handleEndSession">Завершить</button>
			<button v-else class="rounded-xl bg-[#c7c7c7] px-2.5 py-1.5 text-center text-sm font-semibold text-[#f7f8fc]" @click="openModal" disabled>Забронировать</button>
		</div>
	</div>
	<div
		v-if="showCard === 'booked' || showCard === 'bookedNbusy'"
		class="glass fixed bottom-6 mx-[15px] mx-auto flex w-full max-w-[430px] items-center justify-between rounded-[10px] p-4"
		:class="{
			'pointer-events-none touch-none': loadingAccount,
			'!bottom-28': bookedPc && 'currentSession' in bookedPc && 'started_at' in bookedPc.currentSession && bookedPc.currentSession.started_at.length > 0
		}"
	>
		<div>
			<p class="text-sm font-medium">
				Забронировано на
				{{ formatDateTime(bookedPc?.currentReservation?.started_at) }}
			</p>
		</div>
		<div>
			<button v-if="currUser.email === bookedPc.currentReservation.user" class="rounded-xl bg-[#9475ed] px-2.5 py-1.5 text-center text-sm font-semibold text-[#f7f8fc]" @click="handleCancelReservation()">Отменить</button>
			<button v-else class="rounded-xl bg-[#c7c7c7] px-2.5 py-1.5 text-center text-sm font-semibold text-[#f7f8fc]" @click="openModal" disabled>Забронировано</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import PcIconWhite from "../assets/icons/pc-icon-white.svg?url"
import PcIconGrey from "../assets/icons/pc-icon-grey.svg?url"
import PcIconPurple from "../assets/icons/pc-icon-purple.svg?url"
import { usePartnersStore, useAccountStore } from "../stores"
import { Pc } from "../models"
import swipeModal from "@takuma-ru/vue-swipe-modal"
import CloseIcon from "../assets/icons/close-icon.svg?url"
import { format, addDays } from "date-fns"
import { ru } from "date-fns/locale"
import LoadingIconWhite from "../assets/icons/loading-white.svg?url"
import LoadingIcon from "../assets/icons/loading.svg?url"
import type { ComputedRef } from "vue"

const emit = defineEmits(["updatePcList", "showLoading"])

const props = defineProps<{
	zoneName: any
}>()

const showCard: ComputedRef<"free" | "booked" | "busy" | "bookedNbusy" | "empty"> = computed(() => {
	// 4 статуса
	// 1 - свободен
	// 2 - занят (есть сессия)
	// 3 - забронирован (свободен до какого-то времени)
	// 4 - забронирован и занят (сессия и бронь)

	if (bookedPc.value && "uuid" in bookedPc.value && bookedPc.value.uuid && "started_at" in bookedPc.value.currentReservation && bookedPc.value.isBusy) {
		return "bookedNbusy"
	} else if (bookedPc.value && "uuid" in bookedPc.value && bookedPc.value.uuid && "started_at" in bookedPc.value.currentReservation) {
		return "booked"
	} else if (bookedPc.value && "uuid" in bookedPc.value && bookedPc.value.uuid && bookedPc.value.isBusy) {
		return "busy"
	} else if (bookedPc.value && "uuid" in bookedPc.value && bookedPc.value.uuid) {
		return "free"
	} else {
		return "empty"
	}
})

function localeDate(date: any, formatStr = "PP") {
	return format(date, formatStr, {
		locale: ru
	})
}

function formatDateTime(date: any) {
	// date is ISO string, e.g. 2021-05-20T10:00:00.000Z
	// return date in format 20.05.2021 10:00
	const dateObj = new Date(date)
	return format(dateObj, "dd.MM.yyyy HH:mm", {
		locale: ru
	})
}

function countTimeTillNow(date: string) {
	// date is ISO string, e.g. 2021-05-20T10:00:00.000Z
	// return time in hours and minutes, e.g. 1 ч 30 мин
	const now = new Date()
	const sessionStart = new Date(date)
	const diff = now.getTime() - sessionStart.getTime()
	const hours = Math.floor(diff / 1000 / 60 / 60)
	const minutes = Math.floor((diff / 1000 / 60 / 60 - hours) * 60)
	return `${hours} ч ${minutes} мин`
}

const partnersStore = usePartnersStore()
const accountStore = useAccountStore()

const loadingAccount = computed(() => {
	return accountStore.getLoading
})
const loadingPartners = computed(() => {
	return partnersStore.getLoading
})

const currUser = computed(() => {
	return accountStore.user
})

const pcList = computed(function () {
	return Pc.serializeList(partnersStore.pcList)
})

const isModal = ref(false)

const preventDefaultScroll = (e: any) => {
	e.preventDefault()
}

const handleEndSession = () => {
	if (!bookedPc.value) return

	const computerId = bookedPc.value.uuid
	accountStore.logoutComputer(computerId)
	accountStore.clearSession()
	emit("showLoading")
}

const handleCancelReservation = () => {
	if (!bookedPc.value) return
	const reservation_id = bookedPc.value.currentReservation.uuid
	// console.log('cancel reservation', reservation_id)
	accountStore.deleteReservation(reservation_id)
	accountStore.clearReservation()

	bookedPc.value = null
	emit("showLoading")
}

const openModal = () => {
	isModal.value = true
	document.documentElement.style.overflowY = "hidden"
	const modal = document.getElementById("bookingModal")
	modal?.addEventListener("touchmove", preventDefaultScroll)
	setTimeout(() => {
		const innerWheels = Array.from(document.getElementsByClassName("wheel__inner") as HTMLCollectionOf<HTMLElement>)
		const innerWheelFirst = innerWheels[0]
		const innerWheelLast = innerWheels[2]
		innerWheelFirst.style.borderTopLeftRadius = "10px"
		innerWheelFirst.style.borderBottomLeftRadius = "10px"
		innerWheelLast.style.borderTopRightRadius = "10px"
		innerWheelLast.style.borderBottomRightRadius = "10px"
	}, 10)
}

const closeModal = () => {
	isModal.value = false
	document.documentElement.style.overflowY = "auto"
	const modal = document.getElementById("bookingModal")
	modal?.removeEventListener("touchmove", preventDefaultScroll)
}

const { pcCategoryUpdate } = storeToRefs(partnersStore)

const pcArr = ref([])
const bookedPc = ref()

const calcPos = (pc: any) => {
	const elem = document.getElementById(pc.id)
	if (elem !== null) {
		elem.setAttribute("style", `top: ${Number(pc.dataset.y) * 36 + 10 * pc.dataset.y}px; left: ${Number(pc.dataset.x) * 36 + 10 * pc.dataset.x}px`)
	}
}

const calcHeight = () => {
	let verticalPosArr = []
	for (let i = 0; i < pcList.value.length; i++) {
		verticalPosArr.push(pcList.value[i].mapY)
	}
	const max = verticalPosArr.reduce((a: number, b: number) => Math.max(a, b), -Infinity)
	const box = document.getElementById("pcElemWrap")
	box?.setAttribute("style", `min-height: ${max * 46}px`)
}

onMounted(() => {
	getCurrentHour()
	getCurrentMinute()
})

onUpdated(() => {
	calcHeight()
	pcArr.value.forEach((elem: any) => calcPos(elem))
})

const formatDate = (idx: any) => {
	return localeDate(addDays(new Date(), idx), "iii d LLL")
}

const dayValue = ref(0)

const writeDayVal = (value: number) => {
	dayValue.value = value
}

const hourValue = ref(0)

const writeHourVal = (value: number) => {
	hourValue.value = value
}

const minuteValue = ref(0)

const writeMinuteVal = (value: number) => {
	minuteValue.value = value
}

const currentHour = ref(0)
const currentMinute = ref(0)

const getCurrentHour = () => {
	currentHour.value = new Date().getHours()
	setTimeout(getCurrentHour, 1000)
}

const getCurrentMinute = () => {
	currentMinute.value = new Date().getMinutes()
	setTimeout(getCurrentMinute, 1000)
}

const validateBookingDate = computed(() => {
	if (dayValue.value > 0) {
		return true
	} else {
		if (hourValue.value > currentHour.value) {
			return true
		} else {
			if (minuteValue.value > currentMinute.value) {
				return true
			}
		}
	}
	return false
})

const bookChosenPc = () => {
	closeModal()
	let bookPcArr = []
	bookPcArr.push(bookedPc.value)
	emit("updatePcList", bookPcArr, dayValue.value, hourValue.value, minuteValue.value)
}

watchEffect(() => {
	if (pcCategoryUpdate.value) {
		bookedPc.value = {}
	}
})

watch(bookedPc, () => {
	partnersStore.$patch({
		pcCategoryUpdate: false
	})
})
</script>

<style scoped>
.glass {
	background: rgba(255, 255, 255, 0.2);
	border-radius: 16px;
	box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
	backdrop-filter: blur(5px);
	-webkit-backdrop-filter: blur(5px);
	border: 1px solid rgba(255, 255, 255, 0.3);
	width: calc(100% - 30px);
}
.fadeText {
	overflow: hidden;
	text-overflow: ellipsis;
	position: relative;
}
/* .fadeText::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 80%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 50%,
    rgba(255, 255, 255, 1) 100%
  );
} */
</style>

<template>
	<div
		id="header"
		class="pt-safe-2 fixed left-0 top-0 z-[11] mx-auto flex w-full max-w-screen-md items-center justify-center border-b-[1px] border-b-[#eaeaea] bg-white pb-4 text-center text-lg font-bold leading-[22px] text-[#2a2a32]"
		:class="[
			{ 'header-transparent': (!headerClass && !headerBack) || isQrSlide || $route.meta.title === 'QR' },
			{
				'header-blur': !headerClass && !headerBack && $route.meta.title === 'Booking'
			},
			// { '!z-0': isQrSlide },
			{ header: headerClass }
		]"
	>
		<div v-if="$route.meta.title === 'Home'" class="relative flex max-h-[24px] w-full items-center justify-center">
			<!-- <img :src="ProfileIcon" alt="" class="invisible ml-1" width="24" height="24" /> -->
			<h1
				:class="{
					'opacity-0': isQrSlide
				}"
			>
				Ace Gaming
			</h1>
			<!-- <router-link to="/profile" @click="goToProfile" class="mr-1 block">
        <img :src="ProfileIcon" alt="" width="24" height="24" />
      </router-link> -->
			<div v-if="isQrSlide" class="absolute right-3">
				<div @click="handleCloseQrSlide" class="flex items-center justify-center rounded-md bg-white p-1 text-black">
					<IconClose class="h-[1.3em] w-[1.3em]" />
				</div>
			</div>
		</div>
		<div
			v-else-if="$route.meta.title === 'QR' || $route.meta.title === 'Auth' || $route.meta.title === 'Register' || $route.meta.title === 'Forgot' || $route.meta.title === 'Change'"
			class="relative flex max-h-[24px] w-full items-center"
			:class="{
				hidden: $route.meta.title === 'QR'
			}"
		>
			<button class="flex items-center justify-center bg-transparent py-2 text-base font-normal text-[#9475ed]" @click="router.push('/')">
				<img :src="ArrowIcon" alt="" height="24" width="24" style="width: 23px" />
				Назад
			</button>
		</div>
		<div v-else-if="$route.meta.title === 'Profile'" class="flex max-h-[24px] w-full items-center justify-between">
			<button class="flex items-center justify-center text-base font-normal text-[#9475ed]" @click="goBack()">
				<img :src="ArrowIcon" alt="" height="24" width="24" />
				Назад
			</button>
			<h1>Мой профиль</h1>
			<button type="submit" form="profile-info" class="mr-4 flex w-[72px] items-center justify-center text-base font-normal text-[#9475ed]">Сохранить</button>
		</div>
		<div v-else-if="$route.meta.title === 'Clubs'" class="flex h-full max-h-[24px] w-full flex-col items-center justify-center gap-2">
			<div class="relative flex w-full items-center justify-between">
				<button class="flex items-center justify-center text-base font-normal text-[#9475ed]" @click="goBack()">
					<img :src="ArrowIcon" alt="" height="24" width="24" />
					Назад
				</button>
				<h1 class="back-btn absolute left-[50%]">Клубы</h1>
				<div class="flex w-[72px] items-center justify-end gap-[15px] pr-4">
					<button type="button" @click="setFiltersModal(true)">
						<img :src="FilterIcon" alt="" width="24" height="24" />
					</button>
				</div>
			</div>
			<div v-if="headerClass" class="flex w-full px-4">
				<div class="relative mt-1 w-full">
					<img :src="SearchIcon" alt="" width="18" height="18" class="absolute left-3 top-1/4" />
					<form action="" @submit.prevent="searchClub(searchText)">
						<input type="search" placeholder="Поиск..." id="search-bar" v-model="searchText" class="w-full rounded-[10px] border-none bg-[#eaeaea] pl-9 text-base font-normal focus:border-transparent focus:ring-0" />
					</form>
				</div>
			</div>
		</div>
		<div v-else-if="$route.meta.title === 'Booking' || $route.meta.title === 'Receipt'" class="relative flex max-h-[24px] w-full items-center">
			<button class="flex items-center justify-center bg-transparent py-2 text-base font-normal text-[#9475ed]" @click="goBack()">
				<img :src="ArrowIcon" alt="" height="24" width="24" style="width: 23px" />
				Назад
			</button>
			<transition name="fade">
				<h2 v-if="$route.meta.title === 'Booking' && isShowTitle && headerClass" class="back-btn absolute left-[50%]">
					{{ clubInfo }}
				</h2>
			</transition>
		</div>
		<div v-else-if="$route.meta.title === 'Replenish'" class="relative flex max-h-[24px] w-full items-center">
			<button class="flex items-center justify-center bg-transparent py-2 text-base font-normal text-[#9475ed]" @click="goBack()">
				<img :src="ArrowIcon" alt="" height="24" width="24" style="width: 23px" />
				Назад
			</button>
			<transition name="fade">
				<h2 class="back-btn absolute left-[50%]">Пополнить баланс</h2>
			</transition>
		</div>
		<div v-else-if="$route.meta.title === 'Balance' || $route.meta.title === 'Card' || $route.meta.title === 'Fill' || route.meta.title === 'Add Balance'" class="relative flex max-h-[24px] w-full items-center">
			<button class="flex items-center justify-center bg-transparent py-2 text-base font-normal text-[#9475ed]" @click="goBack()">
				<img :src="ArrowIcon" alt="" height="24" width="24" style="width: 23px" />
				Назад
			</button>
			<h1 v-if="$route.meta.title === 'Balance'" class="back-btn absolute left-[50%]">Мой баланс</h1>
			<h1 v-else-if="$route.meta.title === 'Card'" class="back-btn absolute left-[50%]">Новая карта</h1>
			<h1 v-else-if="$route.meta.title === 'Fill'" class="back-btn absolute left-[50%]">Мой баланс</h1>
			<h1 v-else-if="$route.meta.title === 'Add Balance'" class="back-btn absolute left-[50%]">Пополнение</h1>
			<button @click="goToHistory" class="ml-auto mr-3 flex items-center justify-center bg-transparent py-2 text-base font-normal text-[#9475ed]" v-if="$route.meta.title === 'Fill'">История</button>
		</div>
		<div v-else-if="$route.meta.title === 'News'" class="relative flex max-h-[24px] w-full items-center">
			<button class="flex items-center justify-center bg-transparent py-2 text-base font-normal text-[#9475ed]" @click="goBack()">
				<img :src="ArrowIcon" alt="" height="24" width="24" style="width: 23px" />
				Назад
			</button>
			<h1 class="back-btn absolute left-[50%]">Новости</h1>
		</div>
		<div v-else-if="$route.meta.title === 'History' || $route.meta.title === 'History details'" class="relative flex max-h-[24px] w-full items-center">
			<button class="flex items-center justify-center bg-transparent py-2 text-base font-normal text-[#9475ed]" @click="goBack()">
				<img :src="ArrowIcon" alt="" height="24" width="24" style="width: 23px" />
				Назад
			</button>
			<h1 v-if="$route.meta.title === 'History'" class="back-btn absolute left-[50%]">История баланса</h1>
		</div>
		<div v-else-if="$route.meta.title === 'Review'" class="relative flex max-h-[24px] w-full items-center">
			<button class="flex items-center justify-center bg-transparent py-2 text-base font-normal text-[#9475ed]" @click="goBack()">
				<img :src="ArrowIcon" alt="" height="24" width="24" style="width: 23px" />
				Назад
			</button>
			<h1 class="back-btn absolute left-[50%]">Отзывы</h1>
		</div>
		<div v-else-if="$route.meta.title === 'History2' || $route.meta.title === 'History details'" class="relative flex max-h-[24px] w-full items-center">
			<button class="flex items-center justify-center bg-transparent py-2 text-base font-normal text-[#9475ed]" @click="goBack()">
				<img :src="ArrowIcon" alt="" height="24" width="24" style="width: 23px" />
				Назад
			</button>
			<h1 v-if="$route.meta.title === 'History2'" class="back-btn absolute left-[50%]">История баланса</h1>
		</div>
		<div v-else class="relative flex max-h-[24px] w-full items-center">
			<button class="flex items-center justify-center bg-transparent py-2 text-base font-normal text-[#9475ed]" @click="goBack()">
				<img :src="ArrowIcon" alt="" height="24" width="24" style="width: 23px" />
				Назад
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue"

import ProfileIcon from "../assets/icons/avatar-icon.svg?url"
import ArrowIcon from "../assets/icons/chevron_back_28.svg?url"
import SearchIcon from "../assets/icons/search-icon.svg?url"
import FilterIcon from "../assets/icons/filter_24.svg?url"
import MapIcon from "../assets/icons/map-icon.svg?url"
import { usePartnersStore, useAccountStore, useUtilityStore } from "../stores"
import { SafeArea } from "capacitor-plugin-safe-area"

const router = useRouter()
const route = useRoute()
const goBack = () => {
	router.back()
}

const safeAreas = ref({
	top: 0,
	bottom: 0,
	left: 0,
	right: 0
})
SafeArea.getSafeAreaInsets().then(({ insets }) => {
	safeAreas.value = insets
})
const goToHistory = () => {
	router.push("/balance/history")
}
const partnersStore = usePartnersStore()
const accountStore = useAccountStore()
const utilityStore = useUtilityStore()
const { setFiltersModal } = partnersStore

const clubInfo = computed(() => {
	return partnersStore.selectedGameCenter.name
})

const isQrSlide = computed(() => {
	return accountStore.qrSlide
})

const handleCloseQrSlide = () => {
	accountStore.switchQrSlide()
}

const headerBack = computed(() => {
	if (route.meta.title === "Replenish" || route.meta.title === "Clubs" || route.meta.title === "Balance" || route.meta.title === "Card" || route.meta.title === "Home" || route.meta.title === "News" || route.meta.title === "Fill" || route.meta.title === "History" || route.meta.title === "History details" || route.meta.title === "Review" || route.meta.title === "Auth" || route.meta.title === "Profile" || route.meta.title === "Register" || route.meta.title === "Forgot" || route.meta.title === "Change" || route.meta.title === "QR" || route.meta.title === "Add Balance") {
		return true
	} else if (route.meta.title === "Booking" || route.meta.title === "Receipt" || route.meta.title === "Success") {
		return false
	}
})

let scrollpos = window.pageYOffset
const header = document.querySelector(".header")
const headerClass = computed(() => utilityStore.getSearchBarState)
const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

const scrollDown = () => utilityStore.setSearchBarState(true)
const scrollUp = () => utilityStore.setSearchBarState(false)

const isShowTitle = ref(false)

document.addEventListener("scroll", function () {
	scrollpos = window.pageYOffset
	let heading = document.getElementById("clubTitle")
	let headingStart = heading?.offsetTop! - 55
	let headingEnd = heading?.offsetTop! - 31

	if (scrollpos >= headingStart && scrollpos < headingEnd) {
		scrollDown()
	} else if (scrollpos >= headingEnd) {
		scrollDown()
		isShowTitle.value = true
	} else {
		if (searchText.value.length < 1) {
			scrollUp()
		}
	}
	if (headingEnd >= scrollpos && scrollpos > headingStart && !searchText.value.length) {
		isShowTitle.value = false
	}
})

onUpdated(() => {
	let heading = document.getElementById("clubTitle")
	let headingStart = heading?.offsetTop! - 55
	if (searchText.value.length) {
		utilityStore.setSearchBarState(true)
	}
	if (headingStart >= scrollpos && !searchText.value.length) {
		utilityStore.setSearchBarState(false)
	}
	if (vh * 0.27 >= scrollpos && scrollpos > vh * 0.21 && !searchText.value.length) {
		isShowTitle.value = false
	}
})

const searchText = ref("")

const searchClub = (text: string) => {
	let delayTimer: any
	clearTimeout(delayTimer)
	delayTimer = setTimeout(function () {
		partnersStore.loadSearchClubs(text)
	}, 1000)
}

const goToProfile = () => {
	accountStore.setNextRoute("/profile")
}
</script>
41
<style>
.header {
	background-color: #ffffff;
	text-align: center;
}

.header-transparent {
	margin: 0;
	background-color: transparent;
	border: none;
}

/* #header {
  max-width: 430px;
  // нахуя????
} */

.fade-enter-active {
	transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
}

.back-btn {
	transform: translate(-50%, 0);
}
</style>

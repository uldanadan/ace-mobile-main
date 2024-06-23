<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import { SafeArea } from "capacitor-plugin-safe-area"

import { usePartnersStore } from "./stores"
const partnersStore = usePartnersStore()

const route = useRoute()
const page = ref(1)

onMounted(() => {})
const safeAreas = ref({
	top: 0,
	bottom: 0,
	left: 0,
	right: 0
})
SafeArea.getSafeAreaInsets().then(({ insets }) => {
	safeAreas.value = insets
})
const router = useRouter()
document.ondblclick = function (e) {
	e.preventDefault()
}

const transitionName = ref(" ")

router.afterEach((to, from) => {
	const toDepth = to.path.split("/").filter(Boolean).length
	const fromDepth = from.path.split("/").filter(Boolean).length
	transitionName.value = toDepth < fromDepth ? " " : "slide"
})
</script>

<template>
	<main class="relative h-full max-w-screen-md flex-1 bg-white">
		<!-- <router-view v-slot="{ Component, route }">
      <transition :name="transitionName" mode="out-in">
      <div
        :key="String(route.name)"
        class="h-full bg-white"
        :class="{
            'pt-safe': ['Booking', 'Locations'].includes(route.meta.title as string),
            'pt-header-safe': !(['Booking', 'Locations'].includes(route.meta.title as string)),
          }"
      >
      <component :is="Component"></component>
    </div>
    </transition>
  </router-view> -->
		<Header />
		<RouterView />
	</main>
</template>

<style>
* ::-webkit-scrollbar {
	display: none;
	-webkit-appearance: none;
	width: 0;
	height: 0;
}

* {
	-ms-overflow-style: none;
	scrollbar-width: none;
	touch-action: pan-x pan-y;
	box-sizing: border-box;
}

html {
	--ion-safe-area-top: env(safe-area-inset-top);
	--ion-safe-area-bottom: env(safe-area-inset-bottom);
	--ion-safe-area-left: env(safe-area-inset-left);
	--ion-safe-area-right: env(safe-area-inset-right);
}

.pt-safe {
	padding-top: var(--ion-safe-area-top);
}
.pt-safe-2 {
	padding-top: calc(var(--ion-safe-area-top) + 1rem);
}
.pt-header-safe {
	padding-top: calc(var(--ion-safe-area-top) + 57px);
}

.mt-safe {
	margin-top: var(--ion-safe-area-top);
}
.mt-negative-safe {
	margin-top: calc(var(--ion-safe-area-top) * -1);
}

body {
	margin: 0;
	padding: 0;
}

@media only screen and (min-width: 500px) {
	body {
		display: flex;
		justify-content: center;
	}
}

::-webkit-scrollbar {
	width: 0;
	/* Remove scrollbar space */
	background: transparent;
}

main {
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.scanner-hide {
	visibility: visible;
}

.modal-contents {
	max-width: 430px !important;
}

.slide-leave-active,
.slide-enter-active {
	transition: 0.35s;
}
.slide-enter {
	transform: translate(100%, 0);
}
.slide-leave-to {
	transform: translate(-100%, 0);
}
</style>

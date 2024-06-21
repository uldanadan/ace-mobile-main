import { createApp } from "vue"
import "./tailwind.css"
import App from "./App.vue"
import { createRouter, createWebHistory } from "vue-router/auto"
import { createPinia } from "pinia"
import { useAccountStore } from "../src/stores"
import { App as CapacitorApp } from "@capacitor/app"
import { StatusBar, Style } from "@capacitor/status-bar"
import { Capacitor } from "@capacitor/core"
import * as Sentry from "@sentry/vue"
import { BrowserTracing } from "@sentry/tracing"
import { CaptureConsole } from "@sentry/integrations"
// @ts-ignore
import { VueMaskDirective } from "v-mask"
import Vue3TouchEvents from "vue3-touch-events"
import { BarcodeScanner } from "@capacitor-community/barcode-scanner"
import VueSocialSharing from "vue-social-sharing"

const app = createApp(App)

const router = createRouter({
	history: createWebHistory(),
	scrollBehavior(to, from, savedPosition) {
		return { top: 0 }
	}
})
const store = createPinia()

// store.use(({ store }) => {
//   store.router = markRaw(router);
// });

router.beforeResolve(async (to, from, next) => {
	const store = useAccountStore()
	if (to.matched.some(path => path.meta.requiresAuth)) {
		if (store.getToken.length > 0) {
			next()
		} else {
			next({ name: "/auth" })
		}
	} else {
		next()
	}
})

// router.beforeEach(async (to, from, next): Promise<void> => {
//   const store = useAccountStore();
//   if (to.meta.requiresAuth && !store.isAuth) {
//     next({ name: "/auth" });
//   } else {
//     next();
//   }
// });

if (Capacitor.getPlatform() === "android" || Capacitor.getPlatform() === "ios") {
	const setStatusBarStyle = async () => {
		await StatusBar.setBackgroundColor({ color: "#f9fafb" })
		await StatusBar.setStyle({ style: Style.Light })
	}

	setStatusBarStyle()
}

const stopScan = () => {
	BarcodeScanner.showBackground()
	document.body.classList.remove("qrscanner")
	BarcodeScanner.stopScan()
}

CapacitorApp.addListener("backButton", ({ canGoBack }) => {
	Capacitor.getPlatform() != "web" && stopScan()
	if (!canGoBack) {
		CapacitorApp.exitApp()
	} else {
		router.back()
	}
})

// Sentry.init({
//   app,
//   dsn: "https://533136184a2b4299ba27880b0c72d044@o4504059666169856.ingest.sentry.io/4504059670888450",
//   integrations: [
//     new BrowserTracing({
//       routingInstrumentation: Sentry.vueRouterInstrumentation(router),
//       tracingOrigins: ["localhost", "my-site-url.com", /^\//],
//     }),
//     new CaptureConsole({
//       levels: ["error"],
//     }),
//   ],
//   // Set tracesSampleRate to 1.0 to capture 100%
//   // of transactions for performance monitoring.
//   // We recommend adjusting this value in production
//   // tracesSampleRate: 1.0,
// });

const vMaskV2 = VueMaskDirective
const vMaskV3 = {
	beforeMount: vMaskV2.bind,
	updated: vMaskV2.componentUpdated,
	unmounted: vMaskV2.unbind
}

// App.addListener('appUrlOpen', function (event: URLOpenListenerEvent) {
//   // Example url: https://beerswift.app/tabs/tabs2
//   // slug = /tabs/tabs2
//   const slug = event.url.split('.app').pop();

//   // We only push to the route if there is a slug present
//   if (slug) {
//     router.push({
//       path: slug,
//     });
//   }
// });

export { router }

try {
	app.use(router)
	app.use(store)
	app.use(Vue3TouchEvents)
	app.use(VueSocialSharing)
	app.directive("mask", vMaskV3)
	app.mount(document.body)
} catch (e) {
	throw new Error(String(e))
}

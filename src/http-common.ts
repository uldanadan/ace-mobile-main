import axios from "axios"
import { useAccountStore, usePartnersStore } from "./stores"
import { router } from "./main"

export const apiClientPartners = axios.create({
	// baseURL: import.meta.env.VITE_APP_API_ENDPOINT,
	// baseURL: "https://orca-app-by29m.ondigitalocean.app/api/v1"
	// baseURL: "https://orca-app-by29m.ondigitalocean.app/api/v1",
	baseURL: "https://service.acegaming.gg/api/v1"
})

export const apiClientAccount = axios.create({
	// baseURL: import.meta.env.VITE_APP_API_ENDPOINT,
	baseURL: "https://service.acegaming.gg/api/v1"
})

export const apiClientRates = axios.create({
	// baseURL: import.meta.env.VITE_APP_API_ENDPOINT,
	baseURL: "https://service.acegaming.gg/api/v1"
})

apiClientPartners.interceptors.request.use(
	config => {
		const accountStore = useAccountStore()
		const partnersStore = usePartnersStore()
		partnersStore.setLoading(true)
		const token = accountStore.getToken.length > 0 ? `Token ${accountStore.getToken}` : sessionStorage.getItem("token") ? `Token ${sessionStorage.getItem("token")}` : null
		if (token) {
			if (config.headers && token) {
				config.headers.Authorization = token
			}
		}
		return config
	},
	error => {
		const partnersStore = usePartnersStore()
		partnersStore.setLoading(true)
		return Promise.reject(error)
	}
)

apiClientPartners.interceptors.response.use(
	response => {
		const partnersStore = usePartnersStore()
		partnersStore.setLoading(false)
		return response
	},
	error => {
		const partnersStore = usePartnersStore()
		const accountStore = useAccountStore()
		if (error && "response" in error && error.response.status === 401) {
			accountStore.setToken("")
			router.push("/auth")
		}
		partnersStore.setLoading(false)
		return Promise.reject(error)
	}
)

apiClientAccount.interceptors.request.use(
	config => {
		const accountStore = useAccountStore()
		accountStore.setLoading(true)
		const token = accountStore.getToken.length > 0 ? `Token ${accountStore.getToken}` : sessionStorage.getItem("token") ? `Token ${sessionStorage.getItem("token")}` : null
		if (token) {
			if (config.headers && token) {
				config.headers.Authorization = token
			}
		}
		return config
	},
	error => {
		const accountStore = useAccountStore()
		accountStore.setLoading(true)
		return Promise.reject(error)
	}
)

apiClientAccount.interceptors.response.use(
	response => {
		const accountStore = useAccountStore()
		accountStore.setLoading(false)
		return response
	},
	error => {
		const accountStore = useAccountStore()
		if (error && "response" in error && error.response.status === 401) {
			accountStore.setToken("")
			router.push("/auth")
		}
		accountStore.setLoading(false)
		return Promise.reject(error)
	}
)

apiClientRates.interceptors.request.use(
	config => {
		const accountStore = useAccountStore()
		const partnersStore = usePartnersStore()
		const token = accountStore.getToken.length > 0 ? `Token ${accountStore.getToken}` : sessionStorage.getItem("token") ? `Token ${sessionStorage.getItem("token")}` : null
		if (token) {
			if (config.headers && token) {
				config.headers.Authorization = token
			}
		}
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

apiClientRates.interceptors.response.use(
	response => {
		return response
	},
	error => {
		const accountStore = useAccountStore()
		if (error && "response" in error && error.response.status === 401) {
			accountStore.setToken("")
			router.push("/auth")
		}
		return Promise.reject(error)
	}
)

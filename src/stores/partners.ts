import { defineStore } from "pinia"
import { apiClientPartners, apiClientRates } from "../http-common"

export const usePartnersStore = defineStore("partners", {
	state: () => ({
		gameCenterList: [] as any[],
		selectedGameCenter: {
			name: ""
		},
		selectedCenterZones: [{ name: "", uuid: "", busy_computers: 0 }],
		zonesCount: 3,
		pcList: [],
		gameCenterRates: [],
		pcCategoryUpdate: false,
		filtersModal: false,
		loading: false,
		nextPage: false,
		loadingRates: false,
		availablePCs: 0
	}),
	getters: {
		getLoading: state => state.loading
	},

	actions: {
		async loadGameCenters(page: number) {
			if (page === 1) {
				this.$patch({
					gameCenterList: []
				})
			}
			let params = new URLSearchParams([])
			params.set("page", page.toString())
			await apiClientPartners
				.get(`/partners/game-centers/`, { params })
				.then(response => {
					// this.$patch({
					//   gameCenterList: [...response.data.results],
					// });
					this.gameCenterList.push(...response.data.results)
					if (response.data.next !== null) {
						this.$patch({
							nextPage: true
						})
					} else {
						this.$patch({
							nextPage: false
						})
					}
				})
				.catch(error => {
					throw new Error(String(error))
				})
		},

		setSelectedCenter(gameCenter: any) {
			this.$patch({
				selectedGameCenter: gameCenter,
				selectedCenterZones: [...gameCenter.zones]
			})
		},

		async loadPcFromZone(zone: string, gameCenter: string) {
			await apiClientPartners
				.get(`/partners/game-centers/${gameCenter}/zones/${zone}/computers/`)
				.then(response => {
					this.$patch({
						pcList: [...response.data]
					})
					if (this.selectedCenterZones.length > 0) {
						const currZone = this.selectedCenterZones.find((item: any) => item.uuid === zone) || { busy_computers: 0 }
						const busy_comps = currZone.busy_computers || 0
						this.availablePCs = response.data.length - busy_comps
					}
				})
				.catch(error => {
					throw new Error(String(error))
				})
		},

		clearPcList() {
			this.$patch({
				pcList: []
			})
		},

		async loadGameCenterRates(zone: string) {
			this.$patch({
				loadingRates: true
			})
			await apiClientRates
				.get(`/partners/game-centers/${zone}/rates/`)
				.then(response => {
					this.$patch({
						gameCenterRates: [...response.data]
					})
				})
				.catch(error => {
					throw new Error(String(error))
				})
				.then(() => {
					this.$patch({
						loadingRates: false
					})
				})
		},

		setLoading(value: boolean) {
			this.$patch({
				loading: value
			})
		},

		setFiltersModal(value: boolean) {
			this.$patch({
				filtersModal: value
			})
		},
		async loadSearchClubs(name: string) {
			await apiClientPartners
				.get("/partners/game-centers/", {
					params: { search: name }
				})
				.then(response => {
					this.$patch({
						gameCenterList: [...response.data.results]
					})
				})
				.catch(error => {
					throw new Error(String(error))
				})
		},
		async loadFilteredClubs(activeFilters: Array<string>) {
			let params = new URLSearchParams([])
			if (activeFilters.includes("Открыто")) {
				params.set("is_available", "true")
			}
			if (activeFilters.includes("Кухня")) {
				params.set("is_has_kitchen", "true")
			}
			await apiClientPartners
				.get("/partners/game-centers/", {
					params
				})
				.then(response => {
					this.$patch({
						gameCenterList: [...response.data.results]
					})
				})
				.catch(error => {
					throw new Error(String(error))
				})
		}
	}
})

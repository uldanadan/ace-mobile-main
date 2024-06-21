import { defineStore } from "pinia"
import { useStorage } from "@vueuse/core"
import { apiClientAccount } from "../http-common"
import type { CardData, IBalanceHistory } from "../types/types"
import { formatErrors } from "../utils/formatErrors"

export const useAccountStore = defineStore("account", {
	state: () => ({
		isLoggedIn: false,
		accountBalance: 0,
		token: useStorage("token", "", localStorage),
		forgotPassword: false,
		qrLoginStatus: "",
		qrSlide: false,
		computerIdVal: "",
		computerTimeVal: "",
		bookedPc: [] as any[],
		bookingDate: "",
		user: useStorage(
			"user",
			{
				email: "",
				first_name: "",
				last_name: "",
				uuid: "",
				image: ""
			},
			sessionStorage
		),
		error: null,
		isCardChosen: false,
		userCards: [] as Array<CardData>,
		errorData: {} as any,
		nextRoute: "",
		loading: false,
		qrResponseStatus: "",
		qrBalanceData: "",
		session: {
			started_at: "",
			computer_number: 0,
			computer_id: ""
		},
		reservation: {
			started_at: "",
			computer_number: 0,
			computer_id: "",
			uuid: ""
		},
		balanceHistory: [] as IBalanceHistory[]
	}),
	getters: {
		getToken: state => state.token,
		getForgotPassword: state => state.forgotPassword,
		isAuth: state => state.user !== null,
		getLoading: state => state.loading,
		getUser: state => state.user
	},
	actions: {
		// setUser(user: any) {
		//   this.user = user;
		// },
		switchQrSlide() {
			this.qrSlide = !this.qrSlide
		},
		async checkAccount() {
			await apiClientAccount
				.get("/accounts/me/")
				.then(response => {
					this.$patch({
						user: response.data
					})
				})
				.catch()
		},
		logoutUser() {
			this.user = {
				email: "",
				first_name: "",
				last_name: "",
				uuid: "",
				image: ""
			}
			this.token = ""
			this.isLoggedIn = false
			this.accountBalance = 0
			this.session = {
				started_at: "",
				computer_number: 0,
				computer_id: ""
			}
			this.reservation = {
				started_at: "",
				computer_number: 0,
				computer_id: "",
				uuid: ""
			}
		},
		async authLogin(email: string, password: string) {
			await apiClientAccount
				.post("/accounts/login/", { email, password })
				.then(response => {
					this.setToken(response.data)
					localStorage.setItem("token", response.data)
					this.checkAccount()
				})
				.catch(error => {
					console.log(error.message)
					this.$patch({
						error: error.response
					})
					throw new Error(String(error))
				})
		},

		deleteAccount() {
			apiClientAccount.delete("/accounts/delete-all-user-data/").then(() => {
				this.logoutUser()
			})
		},

		async authRegister(email: string, password: string) {
			await apiClientAccount
				.post("/accounts/registration/", { email, password })
				.then(response => {
					this.setToken(response.data)
					this.$patch({
						isLoggedIn: true
					})
				})
				.catch(error => {
					console.log(error)
					this.$patch({
						errorData: error
					})
					throw new Error(String(error))
				})
		},

		async authLoginQR(computerId: string, computerTime: string) {
			await apiClientAccount
				.post("/accounts/login/qr/", {
					computer_id: computerId,
					computer_time: computerTime
				})
				.then(response => {})
				.catch(error => {
					try {
						console.log(formatErrors(error.response.data))

						this.qrResponseStatus = formatErrors(error.response.data)
					} catch {
						this.qrResponseStatus = error
					}
					console.log(error)
					throw new Error(String(error))
				})
		},

		async authPasswordReset(email: string) {
			await apiClientAccount
				.post("/accounts/password/reset/", { email })
				.then(() => this.setForgotPassword(true))
				.catch(error => {
					console.log(error)
					throw new Error(String(error))
				})
		},

		async loadAccountBalance(gameCenterUUID: string) {
			try {
				const response = await apiClientAccount.get(`/accounts/balance/?game_center=${gameCenterUUID}`);
				if (response.status === 200) {
					return response.data.wallet_amount;
				}
			} catch (error) {
				console.error("Error loading balance:", error);
				throw new Error(String(error));
			}
		},

		async loadAccountBalanceHistory(from: string, to: string) {
			await apiClientAccount
				.get(`/accounts/history/${from && to ? `?date_from=${from}&date_to=${to}` : ""}`)
				.then(response => {
					this.$patch({
						balanceHistory: response.data.results
					})
				})
				.catch(error => {
					console.log(error)
					throw new Error(String(error))
				})
		},

		setToken(token: string) {
			this.$patch({
				token: token
			})
		},
		setForgotPassword(value: boolean) {
			this.$patch({
				forgotPassword: value
			})
		},
		setComputerId(computerId: string) {
			this.$patch({
				computerIdVal: computerId
			})
		},
		setComputerTime(computerTime: string) {
			this.$patch({
				computerTimeVal: computerTime
			})
		},
		loadReservation() {
			apiClientAccount.get("/partners/reservations/").then(res => {
				this.$patch({
					reservation: res.data
				})
			})
		},
		deleteReservation(reservation_id: string) {
			console.log(reservation_id)

			apiClientAccount.delete(`/partners/reservations/${reservation_id}/`).then(res => {
				console.log(res)
			})
		},
		clearReservation() {
			this.$patch({
				reservation: {
					started_at: "",
					computer_number: 0,
					computer_id: "",
					uuid: ""
				}
			})
		},

		loadSession() {
			apiClientAccount
				.get("/partners/sessions/")
				.then(res => {
					this.$patch({
						session: res.data
					})
				})
				.catch(error => {
					// console.log(error);
					this.$patch({
						session: {
							started_at: "",
							computer_number: 0,
							computer_id: ""
						}
					})
				})
		},
		clearSession() {
			this.$patch({
				session: {
					started_at: "",
					computer_number: 0,
					computer_id: ""
				}
			})
		},
		logoutComputer(computer_id: string) {
			return apiClientAccount.post("/accounts/logout/", {
				computer_id: computer_id
			})
		},
		async makeReservation(date?: string, pcArray?: Array<any>, isNew?: boolean) {
			let reservationData = <any>[]
			if (isNew && pcArray && date) {
				this.$patch({
					bookedPc: pcArray,
					bookingDate: date
				})
				for (let i = 0; i < pcArray.length; i++) {
					const pcReserve = {
						started_at: date,
						computer: pcArray[i].uuid
					}
					reservationData.push(pcReserve)
				}
			} else {
				for (let i = 0; i < this.bookedPc.length; i++) {
					const pcReserve = {
						started_at: this.bookingDate,
						computer: this.bookedPc[i].uuid
					}
					reservationData.push(pcReserve)
				}
			}
			await apiClientAccount
				.post("/partners/reservations/", JSON.stringify(reservationData), {
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json"
					}
				})
				.then(response => {})
				.catch(error => {
					// console.log('derji', error.response)
					this.$patch({
						error: error.response.data
					})
					throw new Error(String(error))
				})
		},
		setLoading(value: boolean) {
			this.$patch({
				loading: value
			})
		},

		setCardChosen() {
			this.$patch({
				isCardChosen: true
			})
		},
		addUserCard(cardNumber: string, cardName: string, cardMonth: string, cardYear: string, cardCVV: string, cardType: string) {
			const card = {
				cardNumber: cardNumber,
				cardName: cardName,
				cardMonth: cardMonth,
				cardYear: cardYear.toString(),
				cardCVV: cardCVV,
				cardType: cardType,
				cardId: this.userCards.length.toString()
			}
			this.userCards.push(card)
		},
		setNextRoute(route: string) {
			this.$patch({
				nextRoute: route
			})
		},
		async changeUserData(name?: string, lastName?: string) {
			const dataToChange = {
				first_name: name?.length ? name : this.user.first_name,
				last_name: lastName?.length ? lastName : this.user.last_name
			}
			const attachedData = JSON.stringify(dataToChange)
			await apiClientAccount
				.patch("/accounts/me/", attachedData, {
					headers: {
						"Content-Type": "application/json"
					}
				})
				.then(result => {
					console.log("success")
				})
				.catch(error => {
					console.log(error)
					throw new Error(String(error))
				})
		},
		async changeUserPassword(oldPassword: string, newPassword: string) {
			await apiClientAccount
				.post("/accounts/password/", {
					old_password: oldPassword,
					new_password: newPassword
				})
				.then(result => {
					console.log("password change success")
				})
				.catch(error => {
					console.log(error)
					this.$patch({
						error: error
					})
					throw new Error(String(error))
				})
		},
		setQrResponse(value: string) {
			this.$patch({
				qrResponseStatus: value
			})
		},
		setQrBalanceData(value: string) {
			this.$patch({
				qrBalanceData: value
			})
		},
		async addUserBalance(transaction: number, user: string) {
			await apiClientAccount
				.post("/accounts/balance/", {
					transaction_amount: transaction,
					user: user
				})
				.then(result => {
					console.log("success")
				})
				.catch(error => {
					console.log(error)
					this.$patch({
						error: error
					})
					throw new Error(String(error))
				})
		}
	}
})

// @ts-nocheck
import { errorNames } from "./errorNames"

export const formatErrors = (error: any) => {
	if (!error) return "Ошибка сети"
	if (Object.keys(error).length > 10) return "Неверный OTP"
	console.log(Object.keys(error))

	return Object.keys(error)
		.map(key => {
			try {
				if (errorNames[error[key]]) {
					return errorNames[error[key]]
				}
				if (errorNames[key]) {
					return `${errorNames[key]} - ${errorNames[error[key][0]]}`
				}
				if (errorNames[error[key]] && key === "non_field_errors") {
					if (error[key] in errorNames) {
						return errorNames[error[key]]
					} else {
						console.log(error)

						return error[key]
					}
				}
				if (errorNames[error[key]] && key === "detail") {
					return errorNames[error[key]]
				}
				if (errorNames[error[key]] && key === "error") {
					return errorNames[error[key]]
				}
				if (errorNames[error[key]] && key === "message") {
					return errorNames[error[key]]
				}
				if (errorNames[error[key][0]]) {
					return errorNames[error[key][0]]
				}
				if (key === "non_field_errors") {
					return error[key]
				}
				return error
			} catch {
				return error
			}
		})
		.join("<br />")
}

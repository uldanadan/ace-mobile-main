export interface ClubInfo {
  uuid: string
  name: string
  image: string
  rating: number
  address: string
  latitude: number
  longitude: number
  rateFrom: number
  schedule: string
  isAvailable: boolean
  classLevel: number
  appDeeplink: string
  zones: Array<any>
}

export interface NewsData {
  title: string
  text: string
  image: string
}

export interface CardData {
  cardNumber: string
  cardName: string
  cardMonth: string
  cardYear: string
  cardCVV: string
  cardType: string
  cardId: string
}

export interface IBanner {
  url: any
  image: string
}

export interface IBalanceHistory {
  type: 'DEPOSIT' | 'WITHDRAW' | 'REFUND'
  transaction_amount: number
  user_email: string
  created: string
}

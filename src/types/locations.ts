export interface ICurrentPosition {
  lat: number | null
  long: number | null
}

export interface IFriendLocation {
  email: string
  image: string
  location: {
    latitude: number
    longitude: number
    battery_percentage: number
    created_at: string
  }
}

export interface IGameCenterLocation {
  uuid: string
  latitude: number
  longitude: number
  name: string
  logo: string
}

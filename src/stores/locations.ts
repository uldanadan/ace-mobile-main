import { defineStore } from 'pinia'

import { Geolocation } from '@capacitor/geolocation'

import { apiClientAccount, apiClientPartners } from '../http-common'

import type { ICurrentPosition, IFriendLocation, IGameCenterLocation } from '../types/locations'
// import { useStorage } from '@vueuse/core'
// import { apiClientAccount } from '../http-common'
// import { formatErrors } from '../utils/formatErrors'

export const useLocationsStore = defineStore('locations', {
  state: () => ({
    geoPermissionGrantedStatus: '' as '' | 'granted' | 'prompt' | 'denied',
    currentPosition: { lat: null, long: null } as ICurrentPosition,
    currentPositionUpdated: false as boolean,
    geoWatchId: null as number | string | null,
    friendsLocations: [] as IFriendLocation[],
    gameCentersLocations: [] as IGameCenterLocation[],
  }),
  getters: {},
  actions: {
    requestPermission() {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          this.geoPermissionGrantedStatus = result.state
        } else if (result.state === 'prompt') {
          this.geoPermissionGrantedStatus = result.state
        } else if (result.state === 'denied') {
          this.geoPermissionGrantedStatus = result.state
        }
        result.addEventListener('change', () => {
          console.log('change', result.state)

          this.geoPermissionGrantedStatus = result.state

          if (result.state === 'granted') {
            this.getCurrentPosition()
          }
          if (result.state === 'denied') {
            this.clearLocations()
          }
        })
      })
    },

    clearLocations() {
      this.currentPosition.lat = null
      this.currentPosition.long = null
      removeEventListener('change', () => {
        this.geoPermissionGrantedStatus = ''
      })
    },

    clearLocationWatchers() {
      this.currentPosition.lat = null
      this.currentPosition.long = null

      console.log('clearLocationWatchers')
      if (this.geoWatchId !== null && this.geoWatchId) {
        navigator.geolocation.clearWatch(this.geoWatchId as number)
        console.log('clearLocationWatchers - success')
      }
    },
    clearGeolocationWatchersCapacitor() {
      console.log('clearGeolocationWatchersCapacitor')

      Geolocation.clearWatch({ id: this.geoWatchId as string })
        .then(() => {
          console.log('clearGeolocationWatchersCapacitor - success')
        })
        .catch((error) => {
          console.log('clearGeolocationWatchersCapacitor - error', error)
        })
    },

    getCurrentPosition() {
      console.log('getCurrentPosition')
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('position', position)

            if (this.geoPermissionGrantedStatus !== 'granted') {
              this.geoPermissionGrantedStatus = 'granted'
            }
            this.currentPosition.lat = position.coords.latitude
            this.currentPosition.long = position.coords.longitude
          },
          (error) => {
            if (error.code === error.PERMISSION_DENIED) {
              this.geoPermissionGrantedStatus = 'denied'
              console.log('geolocation permission denied')
            }
          }
        )
      } else {
        console.log('geolocation is not supported')
      }
    },

    watchCurrentPosition() {
      let options = {
        enableHighAccuracy: true,
        timeout: 1000,
        maximumAge: 0,
      }
      if ('geolocation' in navigator) {
        this.geoWatchId = navigator.geolocation.watchPosition(
          (position) => {
            console.log('position', position)

            if (this.geoPermissionGrantedStatus !== 'granted') {
              this.geoPermissionGrantedStatus = 'granted'
            }
            this.currentPosition.lat = position.coords.latitude
            this.currentPosition.long = position.coords.longitude
          },
          (error) => {
            if (error.code === error.PERMISSION_DENIED) {
              this.geoPermissionGrantedStatus = 'denied'
              console.log('geolocation permission denied')
            }
          },
          options
        )
      } else {
        console.log('geolocation is not supported')
      }
    },

    geolocationCheckPermission() {
      Geolocation.checkPermissions().then((result) => {
        console.log('geolocationCheckPermission', result)
        this.geoPermissionGrantedStatus = result.location as '' | 'granted' | 'prompt' | 'denied'
      })
    },

    geolocationRequestPermission() {
      Geolocation.requestPermissions().then((result) => {
        console.log('geolocationRequestPermission', result)
        this.geoPermissionGrantedStatus = result.location as '' | 'granted' | 'prompt' | 'denied'
      })
    },

    async getCurrentPositionCapacitor() {
      const res = await Geolocation.getCurrentPosition()

      this.currentPosition.lat = res.coords.latitude
      this.currentPosition.long = res.coords.longitude
      if (this.geoPermissionGrantedStatus !== 'granted') {
        this.geoPermissionGrantedStatus = 'granted'
      }
      this.currentPositionUpdated = !this.currentPositionUpdated

      // return { lat: res.coords.latitude, long: res.coords.longitude }
    },

    watchCurrentPositionCapacitor() {
      Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          timeout: 1000,
          // maximumAge: 1000,
        },
        (position, err) => {
          if (err) {
            // console.log('err', err)
          }
          // console.log('position', position)
          if (position) {
            this.currentPosition.lat = position.coords.latitude
            this.currentPosition.long = position.coords.longitude
            this.geoPermissionGrantedStatus = 'granted'

            this.currentPositionUpdated = !this.currentPositionUpdated
          }
        }
      ).then((watchId) => {
        this.geoWatchId = watchId
      })
    },

    async fetchFriendsLocations() {
      const response = await apiClientAccount.get('/accounts/friends/locations/')
      if (response.data.results.length > 0) {
        this.friendsLocations = response.data.results
      }
    },

    async postLocation() {
      if (!this.currentPosition.lat || !this.currentPosition.long) {
        return
      }
      const response = await apiClientAccount.post('/accounts/locations/', {
        latitude: this.currentPosition.lat.toFixed(6),
        longitude: this.currentPosition.long.toFixed(6),
        battery_percentage: 1,
      })
      if (response.data) {
        console.log('postLocation - success')
      }
    },

    async fetchGameCentersLocations() {
      const response = await apiClientPartners.get('/partners/game-centers/locations/')
      console.log(response)

      this.gameCentersLocations = response.data.results
      console.log(this.gameCentersLocations)
    },

    async addAFriendViaQR(uuid: string) {
      const response = await apiClientAccount.post('/accounts/friends/', {
        friend: uuid,
      })
      if (response.data) {
        console.log('addAFriendViaQR - success')
        return 'success'
      }
    },
  },
})

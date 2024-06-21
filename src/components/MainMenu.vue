<template>
  <div class="mx-auto flex max-h-full w-[90%] flex-col justify-between">
    <div class="glass flex flex-wrap justify-between gap-y-[25px] rounded-[10px] px-4 py-6">
      <MenuItem v-for="(item, itemIdx) in IconArray" :key="itemIdx" :menu-item="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ReserveIcon from '../assets/icons/articles_outline_28.svg?url'
import QrIcon from '../assets/icons/qr_code_outline_28.svg?url'
import BalanceIcon from '../assets/icons/wallet_outline_28.svg?url'
import InfoIcon from '../assets/icons/info_circle_outline_28.svg?url'
import WhatsappIcon from '../assets/icons/IcBaselineWhatsapp.svg?url'
import ProfileIcon from '../assets/icons/profile_28.svg?url'
import GameIcon from '../assets/icons/game_outline_28.svg?url'
import IconLocation from '../assets/icons/icon-location.svg?url'
// import LeaderIcon from '../assets/icons/favorite_outline_white.svg?url'
// import TournamentIcon from '../assets/icons/cup_outline_28.svg?url'
// import CoachingIcon from '../assets/icons/user_microphone_badge_outline_28.svg?url'
// import StoreIcon from '../assets/icons/market_outline_24.svg?url'

const IconArray = [
  { img: QrIcon, name: 'Ace QR', page: 'QR', isAvailable: true, isExternal: false },
  { img: GameIcon, name: 'клубы', page: 'clubs', isAvailable: true, isExternal: false },
  { img: IconLocation, name: 'локации', page: 'locations', isAvailable: true, isExternal: false },
  { img: BalanceIcon, name: 'баланс', page: 'balance/fill', isAvailable: true, isExternal: false },
  { img: ProfileIcon, name: 'профиль', page: 'profile', isAvailable: true, isExternal: true },
  { img: ReserveIcon, name: 'новости', page: 'news', isAvailable: true, isExternal: false },
  { img: WhatsappIcon, name: 'whatsapp', page: 'https://api.whatsapp.com/send/?phone=%2B77064213261&text&type=phone_number&app_absent=0', isAvailable: true, isExternal: true },
  { img: InfoIcon, name: 'о нас', page: 'about', isAvailable: true, isExternal: false },
]
</script>

<style scooped>
.glass {
  background-image: url('/logo/just_icon_trans.png');
  /* background: rgba(255, 255, 255, 0.2); */
  border-radius: 16px;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  -webkit-box-shadow: 0px 0px 41px -10px rgba(34, 60, 80, 0.12);
  -moz-box-shadow: 0px 0px 41px -10px rgba(34, 60, 80, 0.12);
  box-shadow: 0px 0px 41px -10px rgba(34, 60, 80, 0.12);
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}
</style>

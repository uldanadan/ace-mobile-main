<template>
  <div class="border-b-solid rounded-t-[15px] border-b-[1px] border-b-[#eaeaea] pb-[35px] pt-[25px] text-[28px] font-bold leading-[35px] text-[#2a2a32]">
    <div class="mb-5 flex justify-between">
      <transition name="bounce">
        <h1 id="clubTitle" :class="{ 'text-white': !isShowName }">{{ clubDetails?.name }}</h1></transition
      >
      <button class="ml-auto">
        <img :src="UploadIcon" alt="" @click="openShareModal" />
      </button>
    </div>
    <div class="flex flex-col gap-y-7 text-base font-normal leading-[19px]">
      <div class="flex items-center">
        <img :src="StarIcon" alt="" class="mr-[15px]" height="20" width="20" />
        <span>Отлично, {{ clubDetails?.rating }}</span>
      </div>
      <div class="flex items-center">
        <img :src="CarIcon" alt="" class="mr-[15px]" height="20" width="20" />
        <span>{{ clubDetails?.address }}</span>
      </div>
      <div class="flex items-center">
        <img :src="BanknoteIcon" alt="" class="mr-[13px]" height="22" width="22" />
        <span>от {{ clubDetails?.rateFrom }}₸ час</span>
        <button @click="openModal" class="ml-auto rounded-[10px] border-0 border-b-[1px] border-solid border-[#eaeaea] bg-slate-100 px-[18px] py-[5px] text-center text-[13px] font-semibold leading-4 text-[#9475ed]">Тарифы</button>
      </div>
    </div>
    <swipe-modal v-model="isModalShare" contents-height="30vh" border-top-radius="15px" class="z-[6] overflow-auto" id="shareModal" @close="closeShareModal">
      <div class="pb-[30px]">
        <div class="mb-4 flex w-full justify-center">
          <button class="h-6 w-20 border-none border-none outline-none outline-none" @click="closeShareModal">
            <div class="h-1 w-20 rounded-full bg-slate-300"></div>
          </button>
        </div>
        <h3 class="mx-5 mb-6 text-xl font-semibold leading-[25px] text-[#1f2025]">Поделиться</h3>
        <button type="button" class="mb-[15px] ml-[15px] flex gap-4" @click="copyUrl()">
          <img :src="LinkIcon" alt="" width="20" height="20" />
          <div class="text-base font-normal leading-[20px] text-[#2a2a32]">Копировать ссылку</div>
        </button>
        <button type="button" class="mb-[15px] ml-[15px] flex gap-4" @click="saveClub()">
          <img v-if="!isSaved" :src="SaveIcon" alt="" width="20" height="20" />
          <img v-else :src="SaveCompleteIcon" alt="" width="20" height="20" />
          <div class="text-base font-normal leading-[20px] text-[#2a2a32]">Сохранить</div>
        </button>
        <button type="button" class="mb-[15px] ml-[15px] flex gap-4" @click="shareLink">
          <img :src="ShareIcon" alt="" width="20" height="20" />
          <div class="text-base font-normal leading-[20px] text-[#2a2a32]">Поделиться через...</div>
        </button>
      </div>
    </swipe-modal>
    <swipe-modal v-model="isModal" contents-height="50vh" border-top-radius="15px" class="z-[6] overflow-auto" id="rateModal" @close="closeModal">
      <div>
        <div class="mb-4 flex w-full justify-center">
          <button class="h-6 w-20 border-none border-none outline-none outline-none" @click="closeModal">
            <div class="h-1 w-20 rounded-full bg-slate-300"></div>
          </button>
        </div>
        <h3 class="mx-[15px] mb-6 text-xl font-semibold leading-[25px] text-[#1f2025]">Тарифы</h3>
        <div class="mb-[15px] flex flex-col gap-y-5 px-[15px]">
          <pc-category-picker :club-details="clubDetails" type="rate"></pc-category-picker>
          <div class="text-lg font-semibold leading-[22px] text-[#2a2a32]">Стоимость за час</div>
          <div v-if="loadingRates" class="flex items-center justify-center">
            <img class="animate-spin" :src="LoadingIcon" alt="" />
          </div>
          <div v-else class="flex flex-col gap-5">
            <div v-for="(rate, rateIdx) in gameCenterRates" :key="'rate' + rateIdx" class="flex items-center">
              <img :src="ClockIcon" alt="" class="mr-[15px]" />
              <div class="flex w-full justify-between text-base font-normal leading-[19px] text-[#2a2a32]">
                <div class="">
                  {{ dateFormIso(rate.startedAt) }} -
                  {{ dateFormIso(rate.endedAt) }}
                </div>
                <div>{{ rate.price }} ₸</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </swipe-modal>

    <div id="shareDialogBack" class="fixed left-0 top-0 z-10 hidden h-full w-full items-center justify-center bg-[#959697] bg-opacity-50" @click="closeShareDialog">
      <div id="shareDialog" class="z-10 flex w-4/5 flex-col items-center gap-y-2 rounded-[10px] bg-[#ffffff] pt-3 text-base font-normal">
        <div class="text-center">Эта функция доступна только для мобильных устройств</div>
        <button type="button" class="w-full border-t-[1px] border-[#eaeaea] py-2 font-semibold">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import CloseIcon from "../assets/icons/close-icon.svg?url";
  import SaveIcon from "../assets/icons/save-icon.svg?url";
  import SaveCompleteIcon from "../assets/icons/save-complete-icon.svg?url";
  import LinkIcon from "../assets/icons/link-icon.svg?url";
  import ShareIcon from "../assets/icons/share-icon.svg?url";
  import UploadIcon from "../assets/icons/share_external_28.svg?url";
  import StarIcon from "../assets/icons/favorite_outline_20.svg?url";
  import CarIcon from "../assets/icons/location_map_outline_20.svg?url";
  import BanknoteIcon from "../assets/icons/coins_stacks_3_outline_36.svg?url";
  import ClockIcon from "../assets/icons/clock_outline_20.svg?url";
  import NightIcon from "../assets/icons/night-icon.svg?url";
  import PacketIcon from "../assets/icons/packet-icon.svg?url";
  import DiscountIcon from "../assets/icons/discount-icon.svg?url";
  import swipeModal from "@takuma-ru/vue-swipe-modal";
  import type { PropType } from "vue";
  import type { ClubInfo } from "../types/types";
  import { usePartnersStore } from "../stores";
  import { GameCenterRate } from "../models";
  import { format } from "date-fns";
  import LoadingIcon from "../assets/icons/loading.svg?url";

  import { Capacitor } from "@capacitor/core";
  import { Share } from "@capacitor/share";

  const isModal = ref(false);
  const isModalShare = ref(false);
  const store = usePartnersStore();
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

  const props = defineProps({
    clubDetails: {
      type: Object as PropType<ClubInfo>,
    },
  });

  const gameCenterRates = computed(() => GameCenterRate.serializeList(store.gameCenterRates));

  const loading = computed(() => store.getLoading);

  const loadingRates = computed(() => store.loadingRates);

  const dateFormIso = (iso: string) => {
    const date = new Date(iso);
    return format(date, "HH:mm");
  };

  const preventDefaultScroll = (e: any) => {
    e.preventDefault();
  };

  const openModal = () => {
    isModal.value = true;
    document.documentElement.style.overflowY = "hidden";
    window.scrollTo(0, scrollpos.value);
    const modal = document.getElementById("rateModal");
    modal?.addEventListener("touchmove", preventDefaultScroll);
  };

  const closeModal = () => {
    isModal.value = false;
    document.documentElement.style.overflowY = "auto";
    window.scrollTo(0, scrollpos.value);
    const modal = document.getElementById("rateModal");
    modal?.removeEventListener("touchmove", preventDefaultScroll);
  };

  const openShareModal = () => {
    const pltfrm = Capacitor.getPlatform();
    if (pltfrm !== "web") {
      Share.share({
        title: "Ace Gaming",
        text: `Поделиться ссылкой на клуб ${props.clubDetails?.name}`,
        url: `https://acegaming.gg/clubs/${props.clubDetails?.uuid}`,
        dialogTitle: "Поделиться",
      });
      return;
    }
    isModalShare.value = true;
    document.documentElement.style.overflowY = "hidden";
    window.scrollTo(0, scrollpos.value);
    const modal = document.getElementById("shareModal");
    modal?.addEventListener("touchmove", preventDefaultScroll);
  };

  const closeShareModal = () => {
    isModalShare.value = false;
    document.documentElement.style.overflowY = "auto";
    window.scrollTo(0, scrollpos.value);
    const modal = document.getElementById("shareModal");
    modal?.removeEventListener("touchmove", preventDefaultScroll);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    closeShareModal();
  };

  const isSaved = ref(false);

  const saveClub = () => {
    isSaved.value = !isSaved.value;
  };

  const scrollpos = ref(window.pageYOffset);
  const isShowName = ref(true);

  document.addEventListener("scroll", function () {
    scrollpos.value = window.pageYOffset;
    if (scrollpos.value >= vh * 0.27) {
      isShowName.value = false;
    } else {
      isShowName.value = true;
    }
  });

  const closeButton = document.querySelector(".close-button");

  const shareLink = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Club share link",
          url: window.location.href,
        })
        .then(() => {
          console.log("Thanks for sharing!");
        })
        .catch(console.error);
    } else {
      closeShareModal();
      const shareDialog = document.getElementById("shareDialogBack");
      shareDialog?.classList.remove("hidden");
      shareDialog?.classList.add("flex");
    }
  };

  const closeShareDialog = () => {
    const shareDialog = document.getElementById("shareDialogBack");
    shareDialog?.classList.remove("flex");
    shareDialog?.classList.add("hidden");
  };
</script>

<style scoped>
  .modal-contents {
    width: auto;
  }

  .modal-contents-chip-wrapper {
    padding-bottom: 0 !important;
    padding-top: 0 !important;
  }

  .modal-contents-chip {
    --tip-color: #000000 !important;
    margin-top: 16px !important;
  }

  .bounce-enter-active {
    animation: bounce-in 0.3s;
  }
  .bounce-leave-active {
    animation: bounce-in 0.3s reverse;
  }
  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
</style>

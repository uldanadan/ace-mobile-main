<route lang="json">
{
  "meta": {
    "title": "Booking",
    "requiresAuth": false
  }
}
</route>

<template>
  <div class="flex h-full flex-col">
    <div class="wrapper-card bg-[#ffffff]">
      <img :src="gameCenterCurrent?.image" alt="" :style="`width: 100%; height: ${212 + safeAreas.top}px`" class="image-card mb-[-15px] flex items-center justify-center object-cover" width="375" />
    </div>
    <BookingBlock :club-details="selectedGameCenter" @error="writeError" />
  </div>
  <div id="alertModalBack" class="fixed left-0 top-0 z-10 hidden h-full w-full items-center justify-center bg-[#959697] bg-opacity-50" @click="closeAlertModal">
    <div id="alertModal" class="z-10 flex h-[140px] w-[270px] flex-col items-center justify-between rounded-2xl bg-[#ffffff] pt-5">
      <div class="text-[18px] font-bold leading-[22px] text-[#010326]">Бронирование</div>
      <div class="mx-auto mt-1 text-center text-sm font-normal text-[#67687d]" id="modalMsg">{{ errorText }}</div>
      <button type="button" @click="closeAlertModal" class="mt-4 h-full w-full border-t-[1px] border-[#eaeaea]">ОК</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useAccountStore, usePartnersStore } from "../../stores";
  import { GameCenter } from "../../models";
  import { formatErrors } from "../../utils/formatErrors";
  import { ref } from "vue";
  import { SafeArea } from "capacitor-plugin-safe-area";

  const safeAreas = ref({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });
  SafeArea.getSafeAreaInsets().then(({ insets }) => {
    // console.log(insets)
    safeAreas.value = insets;
  });

  const route = useRoute();
  const router = useRouter();

  const partners = usePartnersStore();
  const accountStore = useAccountStore();
  const { setSelectedCenter, loadGameCenters, loadPcFromZone } = partners;

  const errorData = computed(() => accountStore.error);

  onMounted(async () => {
    await loadGameCenters(1);
    // @ts-ignore
    const centerFromPage = gameCenterList.value.find((item) => item.uuid === route.params.id);
    gameCenterCurrent.value = centerFromPage;
    await setSelectedCenter(centerFromPage);
    if (centerFromPage.zones[0]?.uuid !== undefined) {
      await loadPcFromZone(centerFromPage.zones[0]?.uuid, centerFromPage.uuid);
    }
    if (accountStore.bookedPc.length) {
      accountStore
        .makeReservation()
        .then(() => {
          router.push("/receipt");
        })
        .catch((err) => {
          const modalBack = document.getElementById("alertModalBack");
          document.documentElement.style.overflowY = "hidden";
          modalBack?.classList.remove("hidden");
          modalBack?.classList.add("flex");

          writeError(formatErrors(errorData.value));
          accountStore.bookedPc = [];
        });
    }
  });

  const gameCenterCurrent = ref();

  onUnmounted(() => {
    partners.clearPcList();
  });

  const gameCenterList = computed<Array<any>>(() => {
    return GameCenter.serializeList(partners.gameCenterList);
  });

  const loading = computed(() => {
    return partners.getLoading;
  });

  const selectedGameCenter = computed<any>(() => {
    return partners.selectedGameCenter;
  });

  const closeAlertModal = () => {
    const modalBack = document.getElementById("alertModalBack");
    document.documentElement.style.overflowY = "auto";
    modalBack?.classList.remove("flex");
    modalBack?.classList.add("hidden");
  };

  const errorText = ref();

  const writeError = (error: string) => {
    errorText.value = error;
  };
</script>

<style>
  .header-invisible {
    height: 0px !important;
    margin: 0;
    background: transparent;
  }
</style>

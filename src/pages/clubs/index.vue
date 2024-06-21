<route lang="json">
{
  "meta": {
    "title": "Clubs",
    "requiresAuth": false
  }
}
</route>
<template>
  <div v-if="loading" class="pt-header-safe flex h-[80vh] items-center justify-center">
    <img class="animate-spin" :src="LoadingIcon" alt="" />
  </div>
  <div v-else class="pt-header-safe mt-2">
    <div v-if="gameCenterList.length" class="flex flex-col justify-center gap-y-5 px-[15px] pb-14" id="club-list">
      <ClubCard v-for="club in gameCenterList" :key="club.uuid" :club-card-item="club" @click="setSelectedCenter(club)" />
      <div v-if="loadingNotInit" class="mt-2 flex items-center justify-center">
        <img class="animate-spin" :src="LoadingIcon" alt="" />
      </div>
    </div>
    <div v-else class="flex items-center justify-center text-lg font-medium">Нет результатов</div>
  </div>
  <swipe-modal v-model="isModal" contents-height="50vh" border-top-radius="15px" class="overflow-y-auto" @close="closeModal" @open="openModal" id="filterModal">
    <div class="px-[15px]">
      <div class="flex w-full justify-center">
        <button class="flex h-6 w-full justify-center border-none outline-none" @click="closeModal">
          <div class="h-1 w-20 rounded-full bg-slate-300"></div>
        </button>
      </div>
      <div class="relative mb-8 flex items-center justify-start self-stretch">
        <div class="text-[20px] font-semibold leading-[25px] text-[#1f2025]">Фильтровать</div>
      </div>
      <div class="mb-[15px] flex flex-col items-start gap-[10px] border-b-[1px] border-b-[#eaeaea] pb-[15px]">
        <div class="flex items-center gap-[10px]">
          <label v-for="filter in filterArray" class="rounded-[10px] px-[10px] py-[6px] text-xs font-semibold" :class="[activeFilter.some((e: any) => e === filter) ? 'bg-[#9475ed] text-white' : 'bg-[#e5dff8] text-[#9475ed]']">
            {{ filter }}
            <input type="checkbox" class="hidden" :value="filter" v-model="activeFilter" />
          </label>
        </div>
      </div>
      <div class="mb-[20px] flex w-full flex-col items-start gap-[10px] pb-[15px]">
        <div class="text-base font-medium text-[#2a2a32]">Сортировать по</div>
        <div class="flex w-full flex-wrap items-center gap-[10px]">
          <label v-for="sort in sortFilterArray" class="rounded-[10px] border-[1px] px-[10px] py-[6px] text-xs font-medium" :class="[activeSortFilter === sort ? 'border-[#9475ed] text-[#2a2a32]' : 'border-[#c7c7c7] text-[#80808f]']"
            >{{ sort }}
            <input type="radio" class="hidden" :value="sort" v-model="activeSortFilter" />
          </label>
        </div>
      </div>
      <div class="flex">
        <button
          type="button"
          class="ml-auto flex w-full items-center justify-center rounded-[10px] bg-[#9475ed] py-[15px] text-base font-medium text-[#f7f8fc]"
          :class="{
            'pointer-events-none touch-none opacity-60': !buttonActive,
          }"
          @click="filterClubs(activeFilter)">
          Применить
        </button>
      </div>
    </div>
  </swipe-modal>
</template>

<script setup lang="ts">
  import LoadingIcon from "../../assets/icons/loading.svg?url";
  import CloseIcon from "../../assets/icons/close-icon.svg?url";
  import swipeModal from "@takuma-ru/vue-swipe-modal";
  import { usePartnersStore, useUtilityStore } from "../../stores";
  import { GameCenter } from "../../models";

  const partnersStore = usePartnersStore();
  const utilityStore = useUtilityStore();
  const { setSelectedCenter, setFiltersModal } = partnersStore;

  const scrollpos = ref(window.pageYOffset);

  const nextPageExists = computed(() => partnersStore.nextPage);

  document.addEventListener("scroll", function () {
    scrollpos.value = window.scrollY;
    if (needPadding.value) {
      const clubList = document.getElementById("club-list");
      if (clubList !== null) {
        clubList.style.animationName = "addpadding";
        clubList.style.animationPlayState = "running";
      }
    }
    const clubListHeight = document?.getElementById("club-list")?.clientHeight || 0;
    if (scrollpos.value + document.body.offsetHeight - clubListHeight < 100 && scrollpos.value + document.body.offsetHeight - clubListHeight > 0) {
      page.value += 1;
      if (nextPageExists.value) {
        partnersStore.loadGameCenters(page.value);
      }
    }
  });

  const searchBarState = computed(() => utilityStore.getSearchBarState);

  const needPadding = computed(() => searchBarState.value && scrollpos.value === 0);

  const gameCenterList = computed(() => {
    return GameCenter.serializeList(partnersStore.gameCenterList);
  });

  const loading = computed(() => {
    return partnersStore.getLoading && partnersStore.gameCenterList.length === 0;
  });

  const loadingNotInit = computed(() => {
    return partnersStore.getLoading && partnersStore.gameCenterList.length;
  });

  watch(needPadding, () => {
    if (!needPadding.value) {
      const clubList = document.getElementById("club-list");
      if (clubList !== null) {
        clubList.style.animationName = "removepadding";
        clubList.style.animationPlayState = "running";
      }
    }
  });

  watch(gameCenterList, () => {
    if (needPadding.value) {
      const clubList = document.getElementById("club-list");
      if (clubList !== null) {
        clubList.style.animationName = "addpadding";
        clubList.style.animationPlayState = "running";
      }
    }
  });

  const isModal = computed(() => {
    return partnersStore.filtersModal;
  });

  const preventDefaultScroll = (e: any) => {
    e.preventDefault();
  };

  const openModal = () => {
    setFiltersModal(true);
    document.documentElement.style.overflowY = "hidden";
    const modal = document.getElementById("filterModal");
    window.scrollTo(0, scrollpos.value);
    modal?.addEventListener("touchmove", preventDefaultScroll);
  };

  const closeModal = () => {
    setFiltersModal(false);
    const modal = document.getElementById("filterModal");
    document.documentElement.style.overflowY = "auto";
    window.scrollTo(0, scrollpos.value);
    modal?.removeEventListener("touchmove", preventDefaultScroll);
  };

  const filterArray = ["Кухня", "Открыто", "Есть места"];

  const sortFilterArray = ["Рекомендованные", "Рейтинг", "Расстояние", "Стоимость"];

  const activeFilter = ref([]);

  const activeSortFilter = ref("Рекомендованные");

  const showClearFilterBtn = ref(false);

  watch([activeFilter, activeSortFilter], ([newActiveFilter, newActiveSortFilter]) => {
    if (!newActiveFilter.length && newActiveSortFilter === "Рекомендованные") {
      showClearFilterBtn.value = false;
    } else {
      showClearFilterBtn.value = true;
    }
    console.log(newActiveFilter);
    console.log(showClearFilterBtn.value);
  });

  const buttonActive = computed(() => {
    return activeFilter.value.length > 0 || activeSortFilter.value !== "";
  });

  const filterClubs = (activeFilters: Array<string>) => {
    closeModal();
    partnersStore.loadFilteredClubs(activeFilters);
  };

  const page = ref(1);

  onMounted(() => {
    setFiltersModal(false);
    if (!partnersStore.gameCenterList.length) {
      partnersStore.loadGameCenters(page.value);
    }
  });

  onUnmounted(() => {
    setFiltersModal(false);
  });
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

  #club-list {
    animation: 0.5s 1 forwards;
    animation-play-state: paused;
  }

  @keyframes addpadding {
    from {
      padding-top: 1.75rem;
    }

    to {
      padding-top: 3rem;
    }
  }

  @keyframes removepadding {
    from {
      padding-top: 3rem;
    }

    to {
      padding-top: 1.75rem;
    }
  }
</style>

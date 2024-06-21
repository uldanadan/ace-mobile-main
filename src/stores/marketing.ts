import { defineStore } from "pinia";
import { apiClientPartners } from "../http-common";

import type { IBanner } from "../types/types";

export const useMarketingStore = defineStore("marketing", {
  state: () => ({
    newsList: [],
    bannerList: [] as IBanner[],
    loading: false,
  }),
  actions: {
    async loadNews() {
      this.$patch({
        loading: true,
      });
      await apiClientPartners
        .get(`/marketing/news/`)
        .then((response) => {
          this.$patch({
            newsList: [...response.data.results],
          });
        })
        .catch((error) => {
          throw new Error(String(error));
        })
        .then(() => {
          this.$patch({
            loading: false,
          });
        });
    },
    async loadBanners() {
      await apiClientPartners
        .get(`/marketing/banners/`)
        .then((response) => {
          // this.$patch({
          //   bannerList: [...response.data.results],
          // });
          this.bannerList = response.data.results;
        })
        .catch((error) => {
          throw new Error(String(error));
        });
    },
  },

  getters: {
    getBannerList: (state) => {
      return state.bannerList;
    },
  },
});

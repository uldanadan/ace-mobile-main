import { defineStore } from "pinia";

export const useUtilityStore = defineStore("utility", {
  state: () => ({
    searchBarState: false,
  }),
  getters: {
    getSearchBarState: (state) => state.searchBarState,
  },
  actions: {
    setSearchBarState(state: boolean) {
      this.$patch({
        searchBarState: state,
      });
    },
  },
});

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: "button",
  },
});
const emits = defineEmits(["clicked"]);
const clicked = () => {
  emits("clicked");
};
</script>
<template>
  <button
    :type="props.type"
    @click="clicked"
    class="h-[50px] group mt-2 relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-[#9475ed] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
  >
    <slot />
  </button>
</template>

<template>
  <button
    class="text-gray-900 font-bold py-4 px-4 rounded flex items-center"
    @click="clicked"
  >
    <slot />
  </button>
</template>
<script setup>
const emit = defineEmits(["clicked"]);
const clicked = () => {
  emit("clicked");
};
</script>

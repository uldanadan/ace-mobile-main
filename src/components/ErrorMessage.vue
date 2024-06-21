<template>
  <transition
    enter-active-class="transition ease-out duration-250"
    enter-from-class="transform opacity-0 scale-95"
    enter-to-class="transform opacity-100 scale-100"
    leave-active-class="transition ease-in duration-250"
    leave-from-class="transform opacity-100 scale-100"
    leave-to-class="transform opacity-0 scale-95"
  >
    <div v-if="props.isError" class="text-sm">
      <div class="bg-white rounded-md border-gray-100">
        <p
          class="text-center"
          :class="{
            'text-red-500': isError,
            'text-green-400': !isError,
          }"
          v-html="props.message"
        ></p>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
const props = defineProps({
  isError: {
    type: Boolean,
    default: true,
  },
  message: {
    type: String,
    required: true,
  },
});
</script>

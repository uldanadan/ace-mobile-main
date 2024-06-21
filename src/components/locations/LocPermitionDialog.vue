<script lang="ts" setup>
const emits = defineEmits(['confirm'])
const handlePermission = () => {
  emits('confirm')
}
</script>
<template>
  <div class="flex z-10 items-center bg-black/5 w-full h-full min-h-screen absolute">
    <div class="w-[300px] p-8 text-center flex flex-col bg-white rounded-lg items-center absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
      <p>Требуется доступ к GPS</p>
      <button class="px-10 bg-violet-700 py-2 mt-4 rounded-md text-white" @click="handlePermission">Разрешить</button>
    </div>
  </div>
</template>

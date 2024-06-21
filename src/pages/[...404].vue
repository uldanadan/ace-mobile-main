<script setup></script>

<template>
  <header class="bg-white shadow pt-header-safe">
    <div class="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold leading-tight text-gray-900">Not Found</h1>
    </div>
  </header>
</template>

<script setup lang="ts">
const router = useRouter()

onMounted(() => {
  router.push('/')
})
</script>

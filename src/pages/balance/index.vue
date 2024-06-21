<route lang="json">
{
  "meta": {
    "title": "Balance",
    "requiresAuth": true
  }
}
</route>

<template>
  <div class="pt-header-safe">
    <div class="relative h-full bg-[#f9fafb] pt-4 pb-9 flex flex-col justify-end">
      <CurrentBalance />
      <TransactionsList />
      <router-link to="/balance/fill" class="text-[#f7f8fc] flex justify-center items-center leading-[22px] text-[16px] font-semibold bg-[#9475ed] rounded-[10px] w-[90%] mx-auto mt-auto py-[13px]"
        >Пополнить</router-link
      >
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
</script>

<route lang="json">
{
  "meta": {
    "title": "News",
    "requiresAuth": false
  }
}
</route>

<template>
  <div>
    <div v-if="loading" class="flex pt-header-safe justify-center items-center h-[80vh]">
      <img class="animate-spin" :src="LoadingIcon" alt="" />
    </div>
    <div v-else-if="newsList.length && !loading" class="flex pt-header-safe flex-col items-center gap-4 bg-white pt-4">
      <NewsCard v-for="newsCard in newsList" :news-data="newsCard" />
    </div>
    <div v-else class="flex justify-center items-center h-full text-xl font-semibold">Новости не найдены</div>
  </div>
</template>

<script setup lang="ts">
import LoadingIcon from '../assets/icons/loading.svg?url'
import { useMarketingStore } from '../stores'

const marketingStore = useMarketingStore()

const newsList = computed(() => marketingStore.newsList)

const loading = computed(() => marketingStore.loading)

const router = useRouter()

onMounted(async () => {
  await marketingStore.loadNews()
})
</script>

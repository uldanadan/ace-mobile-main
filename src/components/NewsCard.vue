<template>
    <div class="border-b-[1px] border-b-[#eaeaea] pb-4">
        <h5 class="mx-4 text-xl font-medium leading-5 break-words mb-2">{{newsData?.title}}</h5>
        <p class="mx-4 text-base font-normal leading-4 break-words mb-2">{{newsData?.text}}</p>
        <img :src="`${newsData?.image}`" alt="">
    </div>
</template>
  
<script setup lang="ts">
import type { PropType } from "vue";
import type { NewsData } from '../types/types'

const props = defineProps({
  newsData: {
    type: Object as PropType<NewsData>,
  },
})

// export interface NewsItem {
//     img: string;
//     name: string;
//     page: string;
//     isAvailable: boolean;
// }

// const props = defineProps({
//     newsItem: {
//         type: Object as PropType<NewsItem>,
//     },
// });

</script>
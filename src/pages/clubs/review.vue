<route lang="json">
{
  "meta": {
    "title": "Review"
  }
}
</route>

<template>
  <Header></Header>
  <div class="flex flex-col pt-[30px] pb-[50px] pt-header-safe">
    <div class="flex justify-between pb-5 border-b-[1px] border-b-[#eaeaea] px-[15px]">
      <div class="flex flex-col items-center text-[#2a2a32] font-bold ml-[5px]">
        <div class="text-5xl leading-[59px]">8.8</div>
        <div class="text-xl">из 10</div>
      </div>
      <div class="flex flex-col items-end gap-[6px]">
        <div class="flex gap-[10px] items-center">
          <div class="flex gap-1">
            <img v-for="i in 5" :src="StarIcon" alt="" width="8" height="8" />
          </div>
          <div class="bg-gray-200 rounded-full h-[6px] dark:bg-[#eaeaea] w-[168px]">
            <div class="bg-[#80808f] h-[6px] rounded-full" style="width: 45%"></div>
          </div>
        </div>
        <div class="flex gap-[10px] items-center">
          <div class="flex gap-1">
            <img v-for="i in 4" :src="StarIcon" alt="" width="8" height="8" />
          </div>
          <div class="bg-gray-200 rounded-full h-[6px] dark:bg-[#eaeaea] w-[168px]">
            <div class="bg-[#80808f] h-[6px] rounded-full" style="width: 45%"></div>
          </div>
        </div>
        <div class="flex gap-[10px] items-center">
          <div class="flex gap-1">
            <img v-for="i in 3" :src="StarIcon" alt="" width="8" height="8" />
          </div>
          <div class="bg-gray-200 rounded-full h-[6px] dark:bg-[#eaeaea] w-[168px]">
            <div class="bg-[#80808f] h-[6px] rounded-full" style="width: 45%"></div>
          </div>
        </div>
        <div class="flex gap-[10px] items-center">
          <div class="flex gap-1">
            <img v-for="i in 2" :src="StarIcon" alt="" width="8" height="8" />
          </div>
          <div class="bg-gray-200 rounded-full h-[6px] dark:bg-[#eaeaea] w-[168px]">
            <div class="bg-[#80808f] h-[6px] rounded-full" style="width: 45%"></div>
          </div>
        </div>
        <div class="flex gap-[10px] items-center">
          <div class="flex gap-1">
            <img :src="StarIcon" alt="" width="8" height="8" />
          </div>
          <div class="bg-gray-200 rounded-full h-[6px] dark:bg-[#eaeaea] w-[168px]">
            <div class="bg-[#80808f] h-[6px] rounded-full" style="width: 45%"></div>
          </div>
        </div>
        <div class="text-[#80808f] text-sm leading-4 font-medium">15 отзывов</div>
      </div>
    </div>
    <div class="pt-[30px] flex flex-col px-[15px] gap-[15px]">
      <div class="bg-white rounded-[15px] p-[15px] flex flex-col gap-[10px]">
        <div class="flex justify-between items-center">
          <div class="flex flex-col justify-start gap-[5px]">
            <div class="text-[#2a2a32] text-sm leading-[17px] font-bold">Хорошее приложение</div>
            <div class="flex gap-1">
              <img v-for="i in 5" :src="ReviewIcon" alt="" width="12" height="12" />
            </div>
          </div>
          <div class="text-[#80808f] font-medium text-xs flex flex-col items-end">
            <div>5 часов назад</div>
            <div>Deadpool 2016</div>
          </div>
        </div>
        <div class="text-[#2a2a32] font-normal text-sm leading-[14px]">Все отлично работает, удобное приложение</div>
      </div>
      <div class="bg-white rounded-[15px] p-[15px] flex flex-col gap-[10px]">
        <div class="flex justify-between items-center">
          <div class="flex flex-col justify-start gap-[5px]">
            <div class="text-[#2a2a32] text-sm leading-[17px] font-bold">Хорошее приложение</div>
            <div class="flex gap-1">
              <img v-for="i in 5" :src="ReviewIcon" alt="" width="12" height="12" />
            </div>
          </div>
          <div class="text-[#80808f] font-medium text-xs flex flex-col items-end">
            <div>5 часов назад</div>
            <div>Deadpool 2016</div>
          </div>
        </div>
        <div class="text-[#2a2a32] font-normal text-sm leading-[14px]">Все отлично работает, удобное приложение</div>
      </div>
      <div class="bg-white rounded-[15px] p-[15px] flex flex-col gap-[10px]">
        <div class="flex justify-between items-center">
          <div class="flex flex-col justify-start gap-[5px]">
            <div class="text-[#2a2a32] text-sm leading-[17px] font-bold">Хорошее приложение</div>
            <div class="flex gap-1">
              <img v-for="i in 5" :src="ReviewIcon" alt="" width="12" height="12" />
            </div>
          </div>
          <div class="text-[#80808f] font-medium text-xs flex flex-col items-end">
            <div>5 часов назад</div>
            <div>Deadpool 2016</div>
          </div>
        </div>
        <div class="text-[#2a2a32] font-normal text-sm leading-[14px]">Все отлично работает, удобное приложение</div>
      </div>
      <div class="bg-white rounded-[15px] p-[15px] flex flex-col gap-[10px]">
        <div class="flex justify-between items-center">
          <div class="flex flex-col justify-start gap-[5px]">
            <div class="text-[#2a2a32] text-sm leading-[17px] font-bold">Не работает</div>
            <div class="flex gap-1">
              <img :src="ReviewIcon" alt="" width="12" height="12" />
              <img v-for="i in 4" :src="ReviewEmptyIcon" alt="" width="12" height="12" />
            </div>
          </div>
          <div class="text-[#80808f] font-medium text-xs flex flex-col items-end">
            <div>1 месяц назад</div>
            <div>Deadpool 2016</div>
          </div>
        </div>
        <div class="text-[#2a2a32] font-normal text-sm leading-[14px]">Не удалось сделать бронь, зависает. Служба поддержки не работет.</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import StarIcon from '../../assets/icons/rating-icon.svg?url'
import ReviewIcon from '../../assets/icons/rating-color-icon.svg?url'
import ReviewEmptyIcon from '../../assets/icons/rating-color-hollow-icon.svg?url'
</script>

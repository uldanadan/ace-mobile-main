<template>
  <div class="flex flex-col rounded-lg items-center justify-between z-10 p-4 bg-white absolute left-1/2 top-1/2 -translate-x-1/2">
    <div class="py-4">
      <h2 class="text-lg">Вы можете играть до 00:00</h2>
      <p class="text-sm text-gray-400">*после этого имеется бронь</p>
    </div>
    <div class="flex mt-4 items-center gap-4">
      <button
        class="h-[50px] group mt-2 relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-gray-500 bg-[#eee] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Отменить
      </button>
      <button
        class="h-[50px] group mt-2 relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-[#9475ed] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Подтвердить
      </button>
    </div>
  </div>
</template>

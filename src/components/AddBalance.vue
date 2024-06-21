<template>
    <div class="w-[344px] mx-auto absolute bottom-0 left-2/4 translate-x-[-50%]">
        <form action="" id="balance-form" class="pb-2 mb-[30px]" @submit.prevent="addBalance">
            <label for="balance-val" class="text-[#b3b3be] leading-[14px] text-xs font-medium mb-2">Сумма пополнения,
                ₸</label>
            <input type="number" pattern="[0-9]*" inputmode="numeric" name="balance-val" id="balance-val"
                placeholder="Введите сумму" class="bg-transparent border-none outline-none w-full" required>
        </form>
        <button type="submit" form="balance-form"
            class="bg-[#9475ed] rounded-xl text-[#f7f8fc] text-center font-semibold leading-[22px] text-base w-full py-[13px]"
            :class="{ 'opacity-20 touch-none pointer-events-none': !isCardChosen }">Подтвердить</button>
    </div>
</template>

<script setup lang="ts">
import { useAccountStore } from "../stores";

const store = useAccountStore()

const isCardChosen = computed(() => store.isCardChosen)

const addBalance = () => {
    console.log('add')
}

</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    appearance: none;
    -webkit-appearance: none;
    margin: 0;
}

input[type=number] {
    appearance: textfield;
    -moz-appearance: textfield;
    border-bottom: 1px solid #e8e8e8;

}

input[type="number"]:focus {
    outline-style: none;
    box-shadow: none;
    border-color: transparent;
    border-bottom: 1px solid #000000;
}
</style>
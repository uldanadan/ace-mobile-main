<template>
    <div>
        <div class="text-[#80808f] text-base font-semibold ml-4 mb-2">
            Выберите способ пополнения:
        </div>
        <div class="w-full bg-[#f9fafb] flex flex-col pl-4">
            <label v-for="(card, cardIdx) in userCards" :key="cardIdx"
                class="border-b-[#e8e8e8] border-b-[1px] flex items-center justify-between h-16 py-2 pr-5">
                <div class="flex items-center">
                    <img src="../assets/img/visa-card.png" alt="" v-if="card.cardType === 'Visa'">
                    <img src="../assets/img/mastercard-card.png" alt="" v-else>
                    <div class="flex flex-col ml-[15px]">
                        <p class="text-[#2a2a32] leading-[22px] text-base font-medium">{{ card.cardType }}: {{
                                card.cardNumber.slice(-4)
                        }}
                        </p>
                        <p class="text-[#80808f] leading-[18px] text-sm font-normal">Valid thru: {{ card.cardMonth }} /
                            {{ card.cardYear.slice(-2) }}</p>
                    </div>
                </div>
                <img v-if="(cardChosen?.id === card.cardId)" :src="CheckmarkIcon" alt="" width="24" height="24">
                <input type="radio" :id="card.cardId" class="hidden" v-model="cardChosen" :value="card">
            </label>
            <label class="flex items-center justify-between h-16 pr-5 border-b-[#e8e8e8] border-b-[1px] ">
                <div class="flex items-center">
                    <img src="../assets/img/kaspi.png" alt="" class="ml-[10px]">
                    <div class="text-[#80808f] font-medium text-base leading-[22px] ml-[25px] ">Пополнить через Kaspi.kz
                    </div>
                </div>
                <img v-if="cardChosen === 'kaspi'" :src="CheckmarkIcon" alt="" width="24" height="24">
                <input type="radio" id="kaspi" class="hidden" v-model="cardChosen" value="kaspi">
            </label>
            <router-link to="/balance/addCard">
                <div class="border-b-[#e8e8e8] border-b-[1px] flex items-center h-16">
                    <img :src="PlusIcon" alt="" class="ml-[20px]" width="24" height="24">
                    <div class="text-[#80808f] font-medium text-base leading-[22px] ml-[34px]">Добавить банковскую карту
                    </div>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import PlusIcon from "../assets/icons/plus-icon.svg?url"
import CheckmarkIcon from "../assets/icons/card-check-icon.svg?url"
import { useAccountStore } from "../stores";

const store = useAccountStore()

const cardArray = [
    { type: 'Visa', digits: '6978', valid: '06/25', id: '1' },
    { type: 'MasterCard', digits: '6978', valid: '06/25', id: '2' }
]

const userCards = computed(() => {
    return store.userCards
})

const cardChosen = ref()

onUpdated(() => {
    if (cardChosen.value) {
        store.setCardChosen()
    }
})

</script>
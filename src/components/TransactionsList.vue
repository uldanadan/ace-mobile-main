<template>
    <div
        class="p-[5px] h-11 bg-white w-[90%] mx-auto shadow-md rounded-[10px] text-[#2a2a32] font-semibold text-center text-sm uppercase flex items-center mb-[30px]">
        <label v-for="(transaction, transactionIdx) in transactionTypes" :key="'transactionType' + transactionIdx"
            class="w-1/3 h-full flex items-center justify-center"
            :class="{ 'text-white bg-[#9475ed] rounded-[10px]': selectedtransactionType === transaction.value }">{{
                    transaction.name
            }}
            <input type="radio" name="" id="" class="hidden" :value="transaction.value"
                v-model="selectedtransactionType">
        </label>
    </div>
    <div class="flex flex-col pl-4 bg-white">
        <div v-for="(transaction, transactionIdx) in displayedTransactions" :key="'transaction' + transactionIdx"
            class="flex py-3 pr-4 border-b-[1px] border-solid border-[#e8e8e8] justify-between">
            <div class="flex flex-col">
                <div class="text-[#2a2a32] font-medium text-[16px] leading-[22px]">{{ transaction.name }}</div>
                <div class="text-[#80808f] font-normal text-[14px] leading-[18px]">{{ transaction.date }}</div>
            </div>
            <div class="font-medium text-[16px] leading-[22px]"
                :class="[transaction.type === 'fill' ? 'text-[#4caf50]' : 'text-[#af4c4c]']">{{ transaction.value }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const transactionTypes = [
    { name: 'Все', value: 'all' }, { name: 'Пополнения', value: 'fill' }, { name: 'Списания', value: 'charge' }
]
const selectedtransactionType = ref('all')

const transactionList = [
    { name: 'За посещение 123', date: '14.09.2021 3:00', value: '+70', type: 'fill' },
    { name: 'За посещение 1041227', date: '04.09.2021 3:00', value: '-50', type: 'charge' },
    { name: 'За посещение 123', date: '04.09.2021 3:00', value: '+70', type: 'fill' },
    { name: 'За посещение 1041227', date: '04.09.2021 3:00', value: '-50', type: 'charge' },
    { name: 'За посещение 123', date: '14.09.2021 3:00', value: '+70', type: 'fill' },
    { name: 'За посещение 1041227', date: '04.09.2021 3:00', value: '-50', type: 'charge' },
    { name: 'За посещение 123', date: '04.09.2021 3:00', value: '+70', type: 'fill' },
    { name: 'За посещение 1041227', date: '04.09.2021 3:00', value: '-50', type: 'charge' },
    { name: 'За посещение 123', date: '14.09.2021 3:00', value: '+70', type: 'fill' },
    { name: 'За посещение 1041227', date: '04.09.2021 3:00', value: '-50', type: 'charge' },
    { name: 'За посещение 123', date: '04.09.2021 3:00', value: '+70', type: 'fill' },
    { name: 'За посещение 1041227', date: '04.09.2021 3:00', value: '-50', type: 'charge' },
    { name: 'За посещение 123', date: '14.09.2021 3:00', value: '+70', type: 'fill' },
    { name: 'За посещение 1041227', date: '04.09.2021 3:00', value: '-50', type: 'charge' },
]

const displayedTransactions = computed(() => {
    if (selectedtransactionType.value === 'all') {
        return transactionList.slice(0, 5)
    } else if (selectedtransactionType.value === 'fill') {
        return transactionList.filter((e) => e.type === 'fill').slice(0, 5);
    } else if (selectedtransactionType.value == 'charge') {
        return transactionList.filter((e) => e.type === 'charge').slice(0, 5);
    }
    return transactionList
})
</script>
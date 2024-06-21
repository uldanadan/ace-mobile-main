<template>
	<div class="flex h-[32px] w-full touch-manipulation items-center rounded-lg bg-[#eaeaea] p-[2px] leading-4" :class="{ 'mb-5': type === 'pc' }">
		<label v-for="(zone, zoneIdx) in clubDetails?.zones" :key="zone.uuid" class="flex h-full w-full cursor-pointer touch-manipulation items-center justify-center rounded-[7px] text-center text-[13px] font-semibold leading-4 selection:bg-transparent" :class="{ 'bg-[#9475ed] text-[#ffffff]': picked === zone.uuid }">
			{{ zone.name }}
			<input type="radio" name="pc-category" class="hidden" :value="zone.uuid" v-model="picked" @change="changePcCategory(), getZoneName(zone.name)" />
		</label>
	</div>
</template>

<script setup lang="ts">
import type { PropType } from "vue"
import { usePartnersStore } from "../stores"
import type { ClubInfo } from "../types/types"

const props = defineProps({
	clubDetails: {
		type: Object as PropType<ClubInfo>
	},
	type: {
		type: String
	}
})

const emit = defineEmits<{
	(e: "updatePcCategory", pcCategoryUpdated: boolean): void
	(e: "updateZoneName", zoneName: any): void
}>()

const partners = usePartnersStore()
// const accountStore = useAccountStore()
const { loadPcFromZone, loadGameCenterRates } = partners
const route = useRoute()
// @ts-ignore
const gameCenterId = route.params.id

const selectedCenterZones = computed<Array<any>>(() => {
	return partners.$state.selectedCenterZones
})

const picked = ref()
const zoneName = ref()

watchEffect(() => {
	picked.value = partners.$state.selectedCenterZones[0]?.uuid
	zoneName.value = partners.$state.selectedCenterZones[0]?.name
	emit("updateZoneName", zoneName)
})

onMounted(async () => {
	// accountStore.loadReservation()
	// accountStore.loadSession()
	if (props.type === "rate") {
		await loadGameCenterRates(picked.value)
	}
})

const changePcCategory = () => {
	if (props.type === "pc") {
		loadPcFromZone(picked.value, gameCenterId)
	} else if (props.type === "rate") {
		loadGameCenterRates(picked.value)
	}
	partners.$patch({ pcCategoryUpdate: true })
}

const getZoneName = (name: string) => {
	zoneName.value = name
	emit("updateZoneName", zoneName)
}
</script>

<route lang="json">
{
"meta": {
"title": "Fill",
"requiresAuth": true
}
}
</route>

<script setup lang="ts">
import { useAccountStore } from "../../stores";
import QRCode from "qrcode";

const router = useRouter();
const store = useAccountStore();

const isCardChosen = computed(() => store.isCardChosen);

const addBalance = () => {
	console.log("add");
};

const paymentAmount = ref();

const paymentAvailable = computed(() => {
	return paymentAmount.value > 0 && isCardChosen.value;
});

const userData = computed(() => store.user);

onMounted(() => {
	const canvas = document.getElementById("canvas");
	const dataString = `balance ${userData.value.uuid} ${userData.value.email}`;
	QRCode.toCanvas(canvas, dataString, { errorCorrectionLevel: "H", scale: 6 }, function (error: any) {
		if (error) console.error(error)
	})
});

const userDataValue = computed(() => store.user);
</script>

<template>
	<div className="pt-header-safe">
		<div className="relative flex h-full flex-col bg-[#ffffff] pt-6">
			<CurrentBalance />
		</div>
	</div>
</template>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	appearance: none;
	-webkit-appearance: none;
	margin: 0;
}

input[type="number"] {
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

<route lang="json">
{
  "meta": {
    "title": "Card",
    "requiresAuth": true
  }
}
</route>

<template>
  <div class="pt-header-safe">
    <AddCardForm @submit-card="closeCardForm" />
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const closeCardForm = () => {
  router.push('/balance/fill')
}
</script>

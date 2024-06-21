<route lang="json">
{
  "meta": {
    "title": "Privacy Policy",
    "requiresAuth": false
  }
}
</route>

<script lang="ts" setup>
const handleRouteToWhatsApp = () => {
  window.location.href = 'https://api.whatsapp.com/send/?phone=%2B77064213261&text&type=phone_number&app_absent=0'
}
</script>

<template>
  <div class="pt-header-safe">
    <div class="p-4">
      <h1 class="font-bold text-xl">Служба поддержки</h1>
      <div class="flex flex-col gap-y-4">
        <p>
          Если у вас возникли вопросы или проблемы при использовании нашего приложения, не стесняйтесь обращаться к нам за помощью. Наша служба поддержки готова ответить на все ваши вопросы и решить
          любые проблемы, связанные с работой приложения.
        </p>
        <p>Вы можете связаться с нами через WhatsApp по номеру <div class="font-bold underline" @click="handleRouteToWhatsApp">+7(775) 53 02 259</div> или по электронной почте <div class="font-bold">adamara.developer@gmail.com</div></p>
      </div>
      
    </div>
  </div>
</template>

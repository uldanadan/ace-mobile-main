<script lang="ts" setup>
const emits = defineEmits(['emoji'])
// 🔥💩🦄🤣❤️
const emojis = ['🔥', '💩', '🦄', '🤣', '💘']

const activeEmoji = ref('')
const emitEmoji = (emoji: string) => {
  requestAnimationFrame(() => {
    activeEmoji.value = emoji
  })
  emits('emoji', emoji)
  activeEmoji.value = ''
}
</script>
<template>
  <div class="emojis">
    <div
      v-for="emoji in emojis"
      :key="emoji"
      @click="emitEmoji(emoji)"
      class="emoji"
      :class="{
        active: activeEmoji === emoji,
      }"
    >
      {{ emoji }}
    </div>
  </div>
</template>
<style>
.emojis {
  display: flex;
  flex-direction: row;
  background-color: #ffffff;
  align-items: center;
  padding: 0.5rem 1.5rem 1rem 1.5rem;
  border-radius: 4rem;
  box-shadow: 0 2px 12px 2px rgba(0, 0, 0, 0.1);
}
.emojis .emoji {
  cursor: pointer;
  user-select: none;
  font-size: 2rem;
  margin: 0 0.5rem;
  transition: all 0.3s;
}
.emojis .emoji.active {
  animation-name: emoji;
  animation-duration: 0.6s;
  animation-direction: forwards;
  animation-timing-function: ease-out;
  animation-iteration-count: 1;
}
.emojis .emoji:hover {
  transform: scale(1.5);
}

@keyframes emoji {
  5% {
    transform: translateY(1rem);
  }
  10% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateY(-4rem) scale(1.5) rotateY(90deg);
  }
  80% {
    opacity: 0;
  }
  100% {
    transform: translateY(-8rem) scale(2) rotateY(180deg);
    opacity: 0;
  }
}
</style>

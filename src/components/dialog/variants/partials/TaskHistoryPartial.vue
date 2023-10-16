<script setup lang="ts">
import { iTaskLog } from '@/types/taskTypes'

defineProps({
  history: {
    type: Array as () => iTaskLog[],
    required: true,
  },
})
</script>

<template>
  <div class="history-wrapper px-2 pt-3">
    <div v-for="log in history" class="log flex align-items-start mb-3">
      <img class="log__avatar mr-3" :src="log.user.avatarUrl" />
      <div class="flex flex-column">
        <div class="flex">
          <span class="log__user mr-2">{{ log.user.fullName }}</span>
          <span class="log__date">{{ log.createdAt }}</span>
        </div>
        <span class="log__text mt-1">{{ log.text }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.history-wrapper {
  max-height: 245px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 5px;
    height: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #6560ba;
  }

  &::-webkit-scrollbar-track {
    background: #2f2f3b;
  }
}

.log {
  &__avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  &__user,
  &__date {
    font-size: 12px;
    font-weight: 600;
  }
  &__text {
    font-size: 14px;
  }
}
</style>

<script setup lang="ts">
import { iTask } from '@/models/singleProjectTypes'

defineProps({
  task: {
    type: Object as () => iTask,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div
    class="task__tile flex flex-column mb-4"
    :class="{
      'task__tile--disabled': disabled,
    }"
  >
    <span class="task__title mb-1">{{ task.name }}</span>
    <span class="task__description">{{ task.description }}</span>
  </div>
</template>

<style scoped lang="scss">
.task {
  &__tile {
    min-height: 90px;
    width: 100%;
    background-color: #2c2c38;
    border-radius: 8px;
    padding: 24px;
    cursor: pointer;

    &--disabled {
      cursor: not-allowed;
      opacity: 1;
      animation: fade-out 0.1s ease-in-out forwards;
    }
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: #dfdcff;
  }

  &__description {
    font-size: 12px;
    color: #7e828e;
  }
}

@keyframes fade-out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}
</style>

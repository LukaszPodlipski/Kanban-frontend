<script setup lang="ts">
import { Task } from '@/models/singleProjectModels'

defineProps({
  task: {
    type: Object as () => Task,
    required: true,
  },
})
</script>

<template>
  <div class="task__tile flex flex-column mb-4">
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
</style>

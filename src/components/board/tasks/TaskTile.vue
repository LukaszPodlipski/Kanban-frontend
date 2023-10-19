<script setup lang="ts">
import { iTask } from '@/types/taskTypes'

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
    <span class="task__title">{{ task.name }}</span>
    <div class="task__description-wrapper">
      <span
        class="task__description p-0 m-0 mt-2"
        v-html="task.description"
      ></span>
    </div>
    <div class="flex flex-row justify-content-between align-items-end mt-1">
      <span class="task__identifier" v-tooltip.bottom="task.identifier">{{
        task.identifier
      }}</span>
      <div
        class="task__assignee-img"
        v-tooltip.bottom="task.assignee?.fullName || $t('tasks.notAssigned')"
      >
        <img v-if="task.assignee" :src="task.assignee.avatarUrl" />
        <img v-else src="@/assets/images/defaultUser.png" alt="" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.task {
  &__tile {
    min-height: 90px;
    width: 100%;
    background-color: #2c2c38;
    border-radius: 8px;
    padding: 24px 24px 20px 24px;
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

  &__description-wrapper {
    min-height: 26px;
  }

  &__description {
    font-size: 12px;
    color: #7e828e;
    padding-right: 30px;
    display: inline-block;
    width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__assignee-img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #2c2c38;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__identifier {
    font-size: 12px;
    color: #dfdcff;
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

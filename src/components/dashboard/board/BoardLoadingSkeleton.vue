<script setup lang="ts">
import Skeleton from 'primevue/skeleton'

export interface Props {
  numOfColumns?: number
}

withDefaults(defineProps<Props>(), {
  numOfColumns: 4,
})
</script>

<template>
  <div class="flex h-full">
    <div
      v-for="num in Array(numOfColumns).keys()"
      :key="num"
      class="column-wrapper mr-5 mb-6"
    >
      <div
        class="header flex align-items-center mb-4"
        :style="{ animationDelay: `${num * 0.5}s` }"
      >
        <Skeleton shape="circle" size="1rem" class="header__circle mr-3" />
        <Skeleton width="8rem" height="1rem" class="header__title"></Skeleton>
      </div>
      <Skeleton :style="{ animationDelay: `${num * 0.5}s` }" class="column" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.header {
  opacity: 0;
  animation-duration: 1s;
  animation-name: fade-in;
  animation-timing-function: ease-in-out;
  animation-fill-mode: forwards;
  &__circle {
    border-radius: 50%;
    background-color: $grayscale-darken3;
  }
  &__title {
    background-color: $grayscale-darken3;
  }
}

.column-wrapper {
  width: 284px;
}
.column {
  min-height: 100%;
  max-width: 284px;
  background-color: $grayscale-darken3-opacity;
  border-radius: 12px;
  opacity: 0;
  animation-duration: 1s;
  animation-name: fade-in;
  animation-timing-function: ease-in-out;
  animation-fill-mode: forwards;
}
.p-skeleton:after {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0),
    rgba(101, 96, 186, 0.2),
    rgba(255, 255, 255, 0)
  );
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

<script setup lang="ts">
import Skeleton from 'primevue/skeleton'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="flex align-items-center">
    <div
      v-if="$slots.title"
      class="topbar__title"
      :style="{ width: $slots.left ? '250px' : 'auto' }"
    >
      <Skeleton
        v-if="props.loading"
        width="10rem"
        height="2rem"
        borderRadius="16px"
        class="topbar__sceleton"
      ></Skeleton>
      <slot v-else name="title"></slot>
    </div>
    <slot name="left"></slot>
  </div>
  <div class="flex align-items-center">
    <slot name="right"></slot>
  </div>
</template>

<style scoped lang="scss">
.topbar {
  &__title {
    font-size: 24px;
    font-weight: 600;
    color: $primary-lighten;
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
  }

  &__sceleton {
    background-color: transparent;
    width: 200px;
  }
}

.p-skeleton:after {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0),
    rgba(101, 96, 186, 0.2),
    rgba(255, 255, 255, 0)
  );
}
</style>

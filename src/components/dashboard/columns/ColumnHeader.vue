<script setup lang="ts">
defineProps({
  column: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="header flex align-items-center mb-4">
    <div
      class="header__color-circle mr-3"
      :style="{ backgroundColor: column.color }"
    ></div>
    <div class="flex justify-content-between flex-grow-1">
      <span v-if="column?.name" class="header__name mr-2"
        >{{ column.name }} ({{ column.tasks.length }})</span
      >
      <i
        v-if="column.description"
        class="header__info pi pi-info-circle"
        v-tooltip.bottom="column.description"
      ></i>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  width: 284px;

  &__name {
    font-weight: 600;
    text-transform: uppercase;
    font-size: 14px;
    letter-spacing: 0.12em;
    color: $primary-base;
    display: inline-block;
  }

  &__color-circle {
    width: 17px;
    height: 17px;
    border-radius: 50%;
    display: inline-block;
  }

  &__info {
    font-size: 12px;
    color: $primary-base;
  }

  &::before {
    content: '';
    top: -32px;
    position: absolute;
    display: inline-block;
    width: 284px;
    height: 70px;
    background: $grayscale-darken4;
    z-index: -1;
  }
}
</style>

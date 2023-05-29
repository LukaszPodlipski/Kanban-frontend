<script setup lang="ts">
import Button from 'primevue/button'

defineProps({
  label: String,
  icon: String,
  textColor: {
    type: String,
    default: '#DFDCFF',
  },
  backgroundColor: {
    type: String,
    default: '#6560BA',
  },
})
</script>

<template>
  <Button :label="label" :icon="icon ? `pi pi-${icon}` : ''" />
</template>

<style scoped lang="scss">
.p-button {
  color: v-bind(textColor);
  background-color: v-bind(backgroundColor);
  border: 1px solid v-bind(backgroundColor);

  &:enabled:hover {
    background: v-bind(backgroundColor);
    border: 1px solid v-bind(backgroundColor);
  }

  &:focus {
    box-shadow: none;
  }
}
</style>

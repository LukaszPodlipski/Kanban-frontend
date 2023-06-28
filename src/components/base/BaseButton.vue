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
  hoverColor: {
    type: String,
    default: '#474479',
  },
})
</script>

<template>
  <Button v-bind="$attrs" :label="label" :icon="icon ? `pi pi-${icon}` : ''" />
</template>

<style scoped lang="scss">
.p-button {
  color: v-bind(textColor);
  background-color: v-bind(backgroundColor);
  border: 1px solid v-bind(backgroundColor);
  height: 40px;

  &:enabled:hover {
    background: v-bind(hoverColor);
    border: 1px solid v-bind(hoverColor);
  }

  &:focus {
    box-shadow: none;
  }

  &:enabled:active {
    background: v-bind(backgroundColor);
    border: 1px solid v-bind(backgroundColor);
  }
}
</style>

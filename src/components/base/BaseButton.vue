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
  disabled: {
    type: Boolean,
    default: false,
  },
  small: {
    type: Boolean,
    default: false,
  },
  medium: {
    type: Boolean,
    default: false,
  },
  large: {
    type: Boolean,
    default: false,
  },
  spin: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <Button
    v-bind="$attrs"
    :label="label"
    :icon="icon ? `pi pi-${icon} ${spin ? 'pi-spin' : ''}` : ''"
    :disabled="disabled"
    :class="{
      'p-button--small': small && !medium && !large,
      'p-button--medium': medium && !large,
      'p-button--large': large,
    }"
  />
</template>

<style scoped lang="scss">
.p-button {
  color: v-bind(textColor);
  background-color: v-bind(backgroundColor);
  border: 1px solid v-bind(backgroundColor);
  height: 40px;

  &--small {
    padding: 0 !important;
    height: 25px !important;
    width: 25px !important;
  }

  &--medium {
    padding: 0 !important;
    height: 37px !important;
    width: 37px !important;
  }

  &--large {
    padding: 0 !important;
    height: 45px !important;
    width: 45px !important;
  }

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

<script setup lang="ts">
import InputText from 'primevue/inputtext'
import { onMounted, ref } from 'vue'

const props = defineProps({
  modelValue: String,
  label: String,
  loading: Boolean,
})

const guery = ref<string>('')

onMounted(() => {
  if (props.modelValue) {
    guery.value = props.modelValue
  }
})
</script>

<template>
  <span class="p-input-icon-left">
    <i class="pi" :class="!loading ? 'pi-search' : 'pi-spin pi-spinner'" />
    <InputText
      v-model="guery"
      :placeholder="label"
      @update:model-value="(value: string) => $emit('update:modelValue', value)"
      class="w-full"
    />
  </span>
</template>

<style scoped lang="scss">
.input-label {
  color: $primary-base !important;
}

:deep(.p-inputtext) {
  min-width: 250px;
  height: 40px;
  color: $primary-base;
  background: $grayscale-darken3 !important;
  border: 1px solid $primary-base !important;
}

:deep(.p-inputtext:enabled:focus) {
  outline: 0 none;
  outline-offset: 0;
  box-shadow: 0 0 0 0.2rem $primary-base;
  border-color: $primary-base;
}
:deep(.p-invalid) {
  border-radius: 4px;
  outline: 2px solid $base-color-5 !important;
}
:deep(.p-input-icon-left > i:first-of-type) {
  color: $primary-base !important;
}
</style>

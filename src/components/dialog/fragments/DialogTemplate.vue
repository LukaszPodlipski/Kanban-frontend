<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()

defineProps({
  hideActions: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div
    v-if="$slots.customHeader"
    class="custom-header p-4 flex justify-content-between"
  >
    <slot name="customHeader" />
    <i
      style="color: #7e828e"
      class="pi pi-times cursor-pointer align-self-center"
      @click="layoutStore.closeDialog"
    ></i>
  </div>
  <div>
    <slot name="content" />
  </div>
  <div
    v-if="!hideActions"
    class="flex justify-content-end flex-wrap gap-3 w-100 p-4"
  >
    <BaseButton label="Close" icon="times" @click="layoutStore.closeDialog" />
    <slot name="actions" />
  </div>
</template>

<style scoped lang="scss">
.custom-header {
  background: #23232f !important;
}
</style>

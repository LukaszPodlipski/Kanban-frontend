<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout'
import ProgressBar from 'primevue/progressbar'

const layoutStore = useLayoutStore()

defineProps({
  hideActions: {
    type: Boolean,
    default: false,
  },
  denseActions: {
    type: Boolean,
    default: false,
  },
  loading: {
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
    class="flex justify-content-between flex-wrap gap-3 w-100"
    :class="denseActions ? 'pb-4 pt-2 px-4' : 'p-4'"
  >
    <div>
      <slot name="toolsButtons" />
    </div>
    <div class="flex gap-4">
      <BaseButton
        :label="$t('core.close')"
        icon="times"
        @click="layoutStore.closeDialog"
      />
      <slot name="actions" />
    </div>
  </div>
  <div style="height: 3px">
    <ProgressBar v-if="loading" mode="indeterminate"></ProgressBar>
  </div>
</template>

<style scoped lang="scss">
.custom-header {
  background: $grayscale-darken7 !important;
}
</style>

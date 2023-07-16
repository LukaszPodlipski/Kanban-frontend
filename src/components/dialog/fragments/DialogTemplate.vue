<script setup lang="ts">
import stores from '@/stores'

const layoutStore = stores.useLayoutStore()
</script>

<template>
  <div class="pt-4 pb-2">
    <slot name="content" />
  </div>
  <div class="flex justify-content-end flex-wrap gap-3 w-100">
    <BaseButton label="Close" icon="times" @click="layoutStore.closeDialog" />
    <slot name="actions" />
  </div>
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

import stores from '@/stores'
import { computed } from 'vue'

const layoutStore = stores.useLayoutStore()
const dialogData = computed(() => layoutStore.dialog || {})
</script> 

<template>
  <Dialog
    v-model:visible="dialogData.isActive"
    modal
    :header="dialogData.title"
    :style="{ width: '50vw' }"
  >
    <slot name="content"></slot>
    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        @click="layoutStore.closeDialog"
        text
      />
      <slot name="buttons"></slot>
    </template>
  </Dialog>
</template>

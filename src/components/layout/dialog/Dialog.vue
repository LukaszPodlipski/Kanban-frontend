<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout'
import Dialog from 'primevue/dialog'
import { computed, defineAsyncComponent } from 'vue'

const layoutStore = useLayoutStore()
const dialogData = computed(() => layoutStore.dialog || {})

const loadComponent = () => {
  const { component } = dialogData.value || {}
  if (component && !Object.keys(components).includes(component)) {
    components[component] = defineAsyncComponent(
      () => import(`@/components/layout/dialog/variants/${component}.vue`),
    )
  }
  return component || ''
}

const components: { [key: string]: ReturnType<typeof defineAsyncComponent> } =
  {}
</script>

<template>
  <Dialog
    v-model:visible="dialogData.isActive"
    modal
    dismissableMask
    :showHeader="!dialogData.hideHeader"
    :header="dialogData.title"
    @hide="layoutStore.closeDialog"
    :style="{ width: dialogData.size }"
  >
    <component :is="components[loadComponent()]" />
  </Dialog>
</template>

<style scoped lang="scss">
.p-dialog-header {
  background: $grayscale-darken3 !important;
}

:deep(.p-dialog) {
  width: 800px !important;
}
</style>

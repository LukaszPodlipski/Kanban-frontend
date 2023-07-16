<script setup lang="ts">
import Dialog from 'primevue/dialog'
import { useLayoutStore } from '@/stores/layout'
import { computed, defineAsyncComponent } from 'vue'

const layoutStore = useLayoutStore()
const dialogData = computed(() => layoutStore.dialog || {})

const loadComponent = () => {
  const { component } = dialogData.value || {}
  if (component && !Object.keys(components).includes(component)) {
    components[component] = defineAsyncComponent(
      () => import(`@/components/dialog/variants/${component}.vue`),
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
    :header="dialogData.title"
    @hide="layoutStore.closeDialog"
  >
    <component :is="components[loadComponent()]" />
  </Dialog>
</template>

<style scoped lang="scss">
:deep(.p-dialog-header) {
  background: red !important;
}

.p-dialog-header {
  background: #2c2c38 !important;
}

:deep(.p-dialog) {
  background: red !important;
}
</style>

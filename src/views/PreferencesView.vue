<script setup lang="ts">
import LocaleSelector from '@/components/preferences/LocaleSelector.vue'
import { useLayoutStore } from '@/stores/layout'
import { computed } from 'vue'

const layoutStore = useLayoutStore()
const fullSideBar = computed(() => layoutStore.sidebarSize === 'large')
</script>

<template>
  <div class="wrapper p-4 flex flex-wrap gap-4">
    <div class="input-section">
      <span class="label">Język</span>
      <LocaleSelector :flagsOnly="!fullSideBar" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  border-bottom: 3px solid $grayscale-darken5;
  border-left: 3px solid $grayscale-darken5;
  height: 100%;
}
.label {
  font-size: 16px;
  margin-bottom: 10px;
  display: block;
}
.input-section {
  width: 300px;
}
</style>

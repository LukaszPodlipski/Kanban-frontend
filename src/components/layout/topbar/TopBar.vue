<script setup lang="ts">
import { component } from '@/composables/useDynamicTopbar'
</script>

<template>
  <div class="top-bar flex align-items-center justify-content-between">
    <component :is="component()" />
  </div>
</template>

<style scoped lang="scss">
.top-bar {
  height: 80px;
  width: 100%;
  padding: 16px 32px;
  background-color: #2c2c38;
  border-top: 3px solid #2f2f3b;
  border-bottom: 3px solid #2f2f3b;
  border-left: 3px solid #2f2f3b;
}
</style>

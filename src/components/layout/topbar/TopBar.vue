<script setup lang="ts">
import { component } from '@/composables/useDynamicTopbar'
import { useLayoutStore } from '@/stores/layout'
import { computed } from 'vue'

const layoutStore = useLayoutStore()

const isSidebarHidden = computed(() => layoutStore.sidebarSize === 'hidden')
</script>

<template>
  <div class="top-bar flex align-items-center">
    <img
      v-if="isSidebarHidden"
      class="hamburger mr-5"
      src="../../../assets/images/hamburger.svg"
      @click="layoutStore.changeSideBarStatus"
    />
    <div class="flex align-items-center justify-content-between w-full">
      <component :is="component()" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.hamburger {
  height: 37px;
  width: 37px;
  margin-right: 4px;
  rotate: 90deg;
  transform: translateX(1px) translateY(1px);
  animation: rotate 0.2s ease-in-out forwards;
  cursor: pointer;
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(90deg);
  }
}
.top-bar {
  height: 80px;
  width: 100%;
  max-width: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
  padding: 16px 31px;
  background-color: $grayscale-darken3;
  border-top: 3px solid $grayscale-darken5;
  border-bottom: 3px solid $grayscale-darken5;
  border-left: 3px solid $grayscale-darken5;

  &::-webkit-scrollbar {
    width: 10px;
    height: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: $primary-base;
  }

  &::-webkit-scrollbar-track {
    background: $grayscale-darken5;
  }
}
</style>

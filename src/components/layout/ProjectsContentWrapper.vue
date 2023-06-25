<script setup lang="ts">
import { computed } from 'vue'
import ProgressBar from 'primevue/progressbar'
import { useSingleProjectStore } from '@/stores/singleProject'

const singleProjectStore = useSingleProjectStore()
const loading = computed(() => singleProjectStore.loadingUpdate)
</script>

<template>
  <div class="projects-wrapper">
    <ProgressBar
      v-if="loading"
      mode="indeterminate"
      class="progress-bar"
    ></ProgressBar>

    <slot />
  </div>
</template>

<style scoped lang="scss">
.projects-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  max-height: calc(100vh - 80px);
  overflow-y: scroll;
  padding: 24px 32px 32px 32px;
  background-color: #21212d;
  border-bottom: 3px solid #2f2f3b;
  border-left: 3px solid #2f2f3b;

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #6560ba;
  }

  &::-webkit-scrollbar-track {
    background: #2f2f3b;
  }
}

.progress-bar {
  position: absolute;
  z-index: 10;
  top: 0px;
  left: 0;
  height: 3px;
  width: 100%;
}

.projects-wrapper :deep(.p-progressbar) {
  background-color: transparent;
}

.p-progressbar :deep(.p-progressbar-value) {
  background-color: #6560ba !important;
}
</style>

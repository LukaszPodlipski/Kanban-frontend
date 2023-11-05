<script setup lang="ts">
import ColumnsSection from './partials/ColumnsSectionPartial.vue'
import ProjectDataSection from './partials/ProjectDataSectionPartial.vue'
</script>

<template>
  <div class="settings-wrapper flex flex-column gap-4 p-4">
    <ProjectDataSection />
    <ColumnsSection />
  </div>
</template>

<style scoped lang="scss">
.settings-wrapper {
  overflow-y: scroll;
  max-height: calc(100vh - 80px);

  &::-webkit-scrollbar {
    width: 5px;
    height: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: $primary-base;
  }

  &::-webkit-scrollbar-track {
    background: $grayscale-darken5;
  }
}
</style>

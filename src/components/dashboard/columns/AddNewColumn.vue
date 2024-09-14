<script setup lang="ts">
import useProjectTopbarUtilities from '@/composables/useProjectTopbarUtilities'

const { navigateToSettings } = useProjectTopbarUtilities()
</script>
<template>
  <div
    class="add-column flex align-items-center justify-content-center my-6 mr-5"
    @click="navigateToSettings"
  >
    <div class="flex">
      <i class="pi pi-plus mr-2" style="font-size: 1rem"></i>
      <span>{{ $t('columns.addNewColumn') }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.add-column {
  height: 90%;
  width: 284px;
  min-width: 284px;
  background-color: $grayscale-darken7;
  border-radius: 8px;
  color: $grayscale-darken1;
  transition: 0.3s;

  &:hover {
    cursor: pointer;
    background-color: $grayscale-darken3;
  }
}
</style>

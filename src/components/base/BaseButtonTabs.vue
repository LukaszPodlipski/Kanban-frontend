<script setup lang="ts">
type iTab = {
  name: string
  label: string
}

defineProps({
  tabs: {
    type: Array as () => iTab[],
    required: true,
  },
  activeTab: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="p-2 flex">
    <span
      v-for="tab in tabs"
      :key="tab.label"
      class="tab mr-2"
      :class="{ 'tab--active': tab.name === activeTab }"
      @click="$emit('setActiveTab', tab.name)"
      >{{ tab.label }}</span
    >
  </div>
</template>

<style scoped lang="scss">
.tab {
  padding: 4px 8px;
  border-radius: 4px;
  background-color: $grayscale-darken6;
  font-size: 12px;

  &:hover {
    background-color: $grayscale-darken5;
    cursor: pointer;
  }

  &--active {
    background-color: $primary-base;

    &:hover {
      background-color: $primary-base;
      cursor: pointer;
    }
  }
}
</style>

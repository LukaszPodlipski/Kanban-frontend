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
  background-color: #292938;
  font-size: 12px;

  &:hover {
    background-color: #2f2f3b;
    cursor: pointer;
  }

  &--active {
    background-color: #6560ba;

    &:hover {
      background-color: #6560ba;
      cursor: pointer;
    }
  }
}
</style>

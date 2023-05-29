<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSingleProjectStore } from '../../stores/singleProject'

const route = useRoute()

const singleProjectStore = useSingleProjectStore()
const isSingleProjectView = computed(() => route.name === 'SingleProject')

const title = computed(() =>
  isSingleProjectView.value
    ? singleProjectStore.project?.name || 'Explore your projects'
    : 'Explore your projects',
)
</script>

<template>
  <div class="top-bar flex align-items-center justify-content-between">
    <div class="top-bar__title">
      <i
        v-if="singleProjectStore.loading"
        class="pi pi-spin pi-spinner px-4"
        style="font-size: 1.5rem"
      ></i>
      <span v-else>{{ title }}</span>
    </div>
    <div class="top-bar__actions" v-if="isSingleProjectView">
      <BaseButton label="Add New Task" icon="plus" />
    </div>
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

  &__title {
    font-size: 24px;
    font-weight: 600;
    color: #dfdcff;
  }
}
</style>

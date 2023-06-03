<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSingleProjectStore } from '@/stores/singleProject'
import Skeleton from 'primevue/skeleton'

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
      <Skeleton
        v-if="singleProjectStore.loading"
        width="10rem"
        height="2rem"
        borderRadius="16px"
        class="top-bar__sceleton"
      ></Skeleton>

      <span v-else>{{ title }}</span>
    </div>
    <div class="top-bar__actions" v-if="isSingleProjectView">
      <BaseButton
        label="Add New Task"
        icon="plus"
        :disabled="singleProjectStore.loading"
      />
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

  &__sceleton {
    background-color: transparent;
  }
}

.p-skeleton:after {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0),
    rgba(101, 96, 186, 0.2),
    rgba(255, 255, 255, 0)
  );
}
</style>

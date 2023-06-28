<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useSingleProjectStore } from '@/stores/singleProject'
import Skeleton from 'primevue/skeleton'
import ProjectMembers from './ProjectMembers.vue'

const route = useRoute()

const singleProjectStore = useSingleProjectStore()
const isSingleProjectView = computed(() => route.name === 'SingleProject')

const title = computed(() =>
  isSingleProjectView.value
    ? singleProjectStore.project?.name || 'Explore your projects'
    : 'Explore your projects',
)

const searchQuery = ref<string>('')
</script>

<template>
  <div class="top-bar flex align-items-center justify-content-between">
    <div class="flex align-items-center">
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
      <ProjectMembers class="ml-4" />
    </div>
    <div
      class="top-bar__actions flex align-items-center"
      v-if="isSingleProjectView"
    >
      <BaseSearch
        v-model="searchQuery"
        label="Search"
        :disabled="singleProjectStore.loading"
        :loading="singleProjectStore.loading"
        class="mr-4"
      />
      <BaseButton
        label="Add New Task"
        icon="plus"
        :disabled="singleProjectStore.loading"
        class="mr-4"
      />
      <i class="pi pi-cog" :style="{ color: '#6560ba', fontSize: '24px' }"></i>
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
    width: 200px;
  }

  &__sceleton {
    background-color: transparent;
    width: 200px;
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

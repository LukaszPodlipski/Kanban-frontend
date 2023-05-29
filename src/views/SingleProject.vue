<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, watch, onUnmounted } from 'vue'
import { useSingleProjectStore } from '../stores/singleProject'

const singleProjectStore = useSingleProjectStore()
const route = useRoute()
const id = computed(() => route.params.id)
const project = computed(() => singleProjectStore.project)

watch(
  id,
  async () => {
    if (id.value) await singleProjectStore.setSelectedProject(+id.value)
  },
  { immediate: true },
)

onUnmounted(() => {
  singleProjectStore.clearSelectedProject()
})
</script>

<template>
  <p>Project {{ project }}</p>
</template>

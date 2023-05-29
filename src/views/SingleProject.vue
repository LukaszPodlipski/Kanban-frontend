<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, watch } from 'vue'
import { useSingleProjectStore } from '../stores/singleProject'

const singleProjectStore = useSingleProjectStore()
const route = useRoute()
const id = computed(() => route.params.id)
const project = computed(() => singleProjectStore.project)

watch(
  id,
  async () => {
    await singleProjectStore.setSelectedProject(+id.value)
  },
  { immediate: true },
)
</script>

<template>
  <p>Project {{ project }}</p>
</template>

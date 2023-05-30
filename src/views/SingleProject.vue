<script setup lang="ts">
import draggable from 'vuedraggable'

import { useRoute } from 'vue-router'
import { computed, onMounted, onUnmounted, watch, reactive } from 'vue'
import { useSingleProjectStore } from '../stores/singleProject'

const singleProjectStore = useSingleProjectStore()
const route = useRoute()
const id = computed(() => Number(route.params.id))
const project = reactive({ columns: [{ tasks: [] }, { tasks: [] }] })

watch(id, async () => {
  if (id.value)
    await singleProjectStore.setSelectedProject(id.value).then(() => {
      Object.assign(project, singleProjectStore.project)
    })
})

onMounted(async () => {
  await singleProjectStore.setSelectedProject(id.value).then(() => {
    Object.assign(project, singleProjectStore.project)
  })
})

onUnmounted(() => {
  singleProjectStore.clearSelectedProject()
})
</script>

<template>
  <div class="flex">
    <div
      v-show="project"
      v-for="(column, index) in project.columns"
      class="px-5"
    >
      <draggable
        v-model="column[index]"
        group="tasks"
        item-key="id"
        class="list-group"
        :list="column.tasks"
      >
        <template #item="{ element }">
          <div>{{ element.name }}</div>
        </template>
      </draggable>
    </div>
  </div>
</template>

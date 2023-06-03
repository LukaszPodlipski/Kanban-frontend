<script setup lang="ts">
import draggable from 'vuedraggable'
import { useRoute } from 'vue-router'
import { computed, onMounted, onUnmounted, watch, ref } from 'vue'

import { useSingleProjectStore } from '@/stores/singleProject'

import AddNewColumn from '@/components/kanbanTable/AddNewColumn.vue'
import ColumnHeader from '@/components/kanbanTable/ColumnHeader.vue'
import ProjectLoadingSkeleton from '@/components/kanbanTable/ProjectLoadingSkeleton.vue'
import TaskTile from '@/components/kanbanTable/TaskTile.vue'

const singleProjectStore = useSingleProjectStore()
const project = computed({
  get: () => singleProjectStore.project,
  set: (value) => singleProjectStore.updateProject(value),
})

const route = useRoute()
const id = computed(() => Number(route.params.id))

onMounted(async () => {
  await singleProjectStore.setSelectedProject(id.value)
})

watch(id, async () => {
  if (id.value) await singleProjectStore.setSelectedProject(id.value)
})

const isDragging = ref(false)

onUnmounted(() => {
  singleProjectStore.clearSelectedProject()
})
</script>

<template>
  <div
    v-if="!singleProjectStore.loading"
    class="flex h-full flex-column relative"
  >
    <div class="flex columns-wrapper">
      <div
        v-for="column in project?.columns"
        :key="column.id"
        class="column mr-5"
      >
        <ColumnHeader :column="column" />
        <draggable
          v-model="column.tasks"
          group="tasks"
          item-key="id"
          @start="isDragging = true"
          @end="isDragging = false"
          class="h-full mt-4"
          :sections="column.tasks"
        >
          <template #item="{ element }">
            <TaskTile :task="element" :disable="isDragging" />
          </template>
        </draggable>
      </div>
      <AddNewColumn />
    </div>
  </div>
  <ProjectLoadingSkeleton v-else />
</template>

<style scoped lang="scss">
.columns-wrapper {
  position: relative;
}

.column {
  min-height: 100%;
  width: 284px;
  min-width: 284px;
  position: relative;
}
</style>

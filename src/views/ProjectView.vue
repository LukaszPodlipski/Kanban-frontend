<script setup lang="ts">
import draggable from 'vuedraggable'
import { useRoute } from 'vue-router'
import {
  computed,
  onMounted,
  onBeforeMount,
  onUnmounted,
  watch,
  ref,
} from 'vue'

import stores from '@/stores'

import AddNewColumn from '@/components/table/columns/AddNewColumn.vue'
import ColumnHeader from '@/components/table/columns/ColumnHeader.vue'
import TableLoadingSkeleton from '@/components/table/TableLoadingSkeleton.vue'
import TaskTile from '@/components/table/tasks/TaskTile.vue'

/* -------------------------------- USE STORE ------------------------------- */
const projectStore = stores.useProjectStore()
const tasksStore = stores.useTasksStore()
const websocketStore = stores.useWebsocketStore()

const project = computed(() => projectStore.project)
/* -------------------------------- GET PROJECT ------------------------------- */
const route = useRoute()
const id = computed(() => Number(route.params.id))

onBeforeMount(() => {
  websocketStore.joinChannel('TasksIndexChannel', { projectId: id.value })
})

onMounted(async () => {
  await projectStore.getCompleteProject(id.value)
})

watch(id, async () => {
  if (id.value) {
    websocketStore.leaveChannel('TasksIndexChannel')
    websocketStore.joinChannel('TasksIndexChannel', { projectId: id.value })
    projectStore.getCompleteProject(id.value)
  }
})

/* -------------------------------- CLEAR PROJECT ------------------------------- */
onUnmounted(() => {
  projectStore.clearSelectedProject()
  websocketStore.leaveChannel('TasksIndexChannel')
})
/* -------------------------------- DRAGGING LOGIC ------------------------------- */

// to apply styles to the dragged element we need to use this hack with isDraggingHelper
// because vuedraggable doesn't provide any props to do this out of the box
// element has to be dragged for min. 100ms
const isDragging = ref<boolean>(false)
const isDraggingHelper = ref<boolean>(false)
let dragTimeout: any = null

watch(isDraggingHelper, (newVal) => {
  if (newVal) {
    dragTimeout = setTimeout(() => {
      isDragging.value = true
    }, 100)
  } else {
    isDragging.value = false
    clearTimeout(dragTimeout)
  }
})

const draggedElementId = ref<number | null>(null)

const chooseDraggingItem = (evt: any) => {
  isDraggingHelper.value = true
  draggedElementId.value = Number(evt.item.id)
}

const unChoooseDraggingItem = () => {
  draggedElementId.value = null
  isDraggingHelper.value = false
}

const moveTask = (evt: any) => {
  const draggedTask = JSON.parse(JSON.stringify(evt.item))._underlying_vm_ || {}
  const sourceIndex = evt?.oldDraggableIndex
  const targetIndex = evt?.newDraggableIndex
  const sourceColumnId = evt?.from?.id
  const targetColumnId = evt?.to?.id

  if (sourceColumnId !== targetColumnId || sourceIndex !== targetIndex) {
    const data = {
      targetColumnId: Number(targetColumnId),
      targetIndex,
    }
    // projectStore.moveTask(data)
    tasksStore.updateItemWithSpecificAction(
      Number(draggedTask.id),
      'move',
      data,
    )
  }
}
</script>

<template>
  <div v-if="!projectStore.loading" class="flex h-full flex-column relative">
    <div class="flex columns-wrapper">
      <div
        v-for="column in project?.columns"
        :key="column.id"
        class="column mr-5"
      >
        <ColumnHeader :column="column" />
        <draggable
          v-model="column.tasks"
          :sections="column.tasks"
          :id="column.id"
          @choose="chooseDraggingItem"
          @unchoose="unChoooseDraggingItem"
          @end="moveTask"
          item-key="id"
          group="tasks"
          ghost-class="task-ghost"
          class="h-full mt-4"
        >
          <template #item="{ element }">
            <TaskTile
              v-if="!element.updating"
              :id="element.id"
              :task="element"
              :disabled="isDragging && draggedElementId != +element.id"
            />
          </template>
        </draggable>
      </div>
      <AddNewColumn />
    </div>
  </div>
  <TableLoadingSkeleton v-else />
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

.task-ghost {
  opacity: 0;
  -webkit-box-shadow: 3px 11px 49px -25px rgba(101, 96, 186, 1);
  -moz-box-shadow: 3px 11px 49px -25px rgba(101, 96, 186, 1);
  box-shadow: 3px 11px 49px -25px rgba(101, 96, 186, 1);
}

.sortable-chosen {
  cursor: grabbing !important;
}
</style>
@/stores/project

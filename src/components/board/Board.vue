<script setup lang="ts">
import TableLoadingSkeleton from '@/components/board/BoardLoadingSkeleton.vue'
import AddNewColumn from '@/components/board/columns/AddNewColumn.vue'
import ColumnHeader from '@/components/board/columns/ColumnHeader.vue'
import TaskTile from '@/components/board/tasks/TaskTile.vue'
import usePermittedUser from '@/composables/usePermittedUser'
import { useLayoutStore } from '@/stores/layout'
import { useProjectStore } from '@/stores/project'
import { useTasksStore } from '@/stores/tasks'
import { useWebsocketStore } from '@/stores/websocket'
import { iTask } from '@/types/taskTypes'
import ProgressBar from 'primevue/progressbar'
import {
  computed,
  onBeforeMount,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue'
import { useRoute } from 'vue-router'
import draggable from 'vuedraggable'

/* -------------------------------- USE STORE ------------------------------- */
const projectStore = useProjectStore()
const tasksStore = useTasksStore()
const websocketStore = useWebsocketStore()
const layoutStore = useLayoutStore()

const project = computed(() => projectStore.project)
/* -------------------------------- GET PROJECT ------------------------------- */
const route = useRoute()
const id = computed(() => Number(route.params.id))

onBeforeMount(() => {
  // websocketStore.joinChannel('TasksIndexChannel', { projectId: id.value })
  // websocketStore.joinChannel('ColumnsIndexChannel', { projectId: id.value })
})

onMounted(async () => {
  await projectStore.getCompleteProject(id.value)
})

// watch(id, async () => {
//   if (id.value) {
//     websocketStore.leaveChannel('TasksIndexChannel')
//     websocketStore.joinChannel('TasksIndexChannel', { projectId: id.value })
//     projectStore.getCompleteProject(id.value)

//     websocketStore.leaveChannel('ColumnsIndexChannel')
//     websocketStore.joinChannel('ColumnsIndexChannel', { projectId: id.value })
//   }
// })

/* -------------------------------- CLEAR PROJECT ------------------------------- */
onUnmounted(() => {
  websocketStore.leaveChannel('TasksIndexChannel')
  websocketStore.leaveChannel('ColumnsIndexChannel')
})
/* -------------------------------- DRAGGING LOGIC ------------------------------- */

// to apply styles to the dragged element we need to use this hack with isDraggingHelper
// because vuedraggable doesn't provide any props to do this out of the box
// element has to be dragged for min. 100ms
const isDragging = ref<boolean>(false)
const isDraggingHelper = ref<boolean>(false)
let dragTimeout: any = null

watch(isDraggingHelper, (newVal: boolean) => {
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
const { isViewer } = usePermittedUser()

const openTaskDialog = (task: iTask) => {
  layoutStore.openDialog({
    title: task.name,
    component: 'TaskDialog',
    item: task,
    hideHeader: true,
    size: '900px',
  })
}
</script>

<template>
  <div class="projects-wrapper">
    <ProgressBar
      v-if="tasksStore.loading"
      mode="indeterminate"
      class="progress-bar"
    ></ProgressBar>
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
            :disabled="isViewer"
            @choose="chooseDraggingItem"
            @unchoose="unChoooseDraggingItem"
            @end="moveTask"
            item-key="id"
            group="tasks"
            ghost-class="task-ghost"
            class="h-full mt-4"
          >
            <template #item="{ element: task }">
              <TaskTile
                v-if="!task.updating"
                :id="task.id"
                :task="task"
                :disabled="isDragging && draggedElementId != +task.id"
                @click="openTaskDialog(task)"
              />
            </template>
          </draggable>
        </div>
        <AddNewColumn />
      </div>
    </div>
    <TableLoadingSkeleton v-else />
  </div>
</template>

<style scoped lang="scss">
.projects-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  max-height: calc(100vh - 80px);
  overflow-y: scroll;
  padding: 24px 32px 32px 32px;
  background-color: #21212d;
  border-bottom: 3px solid #2f2f3b;
  border-left: 3px solid #2f2f3b;

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #6560ba;
  }

  &::-webkit-scrollbar-track {
    background: #2f2f3b;
  }
}

.progress-bar {
  position: absolute;
  z-index: 10;
  top: 0px;
  left: 0;
  height: 3px;
  width: 100%;
}

.projects-wrapper :deep(.p-progressbar) {
  background-color: transparent;
}

.p-progressbar :deep(.p-progressbar-value) {
  background-color: #6560ba !important;
}
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

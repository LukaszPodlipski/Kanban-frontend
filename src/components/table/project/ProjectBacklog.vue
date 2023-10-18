<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

import { useLayoutStore } from '@/stores/layout'
import { useProjectStore } from '@/stores/project'
import { useTasksStore } from '@/stores/tasks'
import { useWebsocketStore } from '@/stores/websocket'
import { iTask } from '@/types/taskTypes'
import {
  computed,
  onBeforeMount,
  onMounted,
  onUnmounted,
  watch,
} from 'vue'
import { useRoute } from 'vue-router'

import useResizableTable from '@/composables/useResizableTable'
import { trimText, formatDate } from '@/utils/functions'

const tasksStore = useTasksStore()
const websocketStore = useWebsocketStore()
const projectStore = useProjectStore()
const layoutStore = useLayoutStore()

const route = useRoute()
const id = computed(() => Number(route.params.id))

onBeforeMount(() => {
  websocketStore.joinChannel('TasksIndexChannel', { projectId: id.value })
})

const backlogTasks = computed(() =>
  tasksStore.items.filter((task) => task.projectColumnId === null),
)

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

onUnmounted(() => {
  projectStore.clearSelectedProject()
  websocketStore.leaveChannel('TasksIndexChannel')
})

const { tableHeight } = useResizableTable()

const openTaskDialog = (payload: any) => {
  const task: iTask = payload.data
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
  <div class="backlog-wrapper">
    <DataTable
      :value="backlogTasks"
      tableStyle="min-width: 50rem"
      size="small"
      @rowSelect="openTaskDialog"
      selectionMode="single"
      dataKey="id"
      removableSort
      scrollable
      :scrollHeight="tableHeight"
      :metaKeySelection="false"
      :loading="tasksStore.loading"
    >
      <Column field="" header=""></Column>
      <Column field="identifier" :header="$t('backlog.identifier')"></Column>
      <Column field="name" :header="$t('backlog.name')" sortable></Column>
      <Column field="description" :header="$t('backlog.description')">
        <template #body="{ data }">
          <span v-html="trimText(data.description, 52)"></span>
        </template>
      </Column>
      <Column field="assignee.fullName" :header="$t('backlog.assignee')" sortable>
        <template #body="{ data }">
          <div v-if="data.assignee" class="flex align-items-center">
            <img class="task__avatar mr-3" :src="data.assignee.avatarUrl" />
            <span>{{ data.assignee.fullName }}</span>
          </div>
          <span class="task__avatar--placeholder" v-else>{{ $t('tasks.notAssigned') }}</span>
        </template>
      </Column>
      <Column field="createdAt" :header="$t('backlog.createdAt')" sortable>
        <template #body="{ data }">
          <span>{{ formatDate(data.createdAt) }}</span>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped lang="scss">
.backlog-wrapper {
  border-left: 3px solid #2f2f3b;
  height: 100%;
}

.task {
  &__avatar {
    height: 20px;
    width: 20px;
    border-radius: 50%;

    &--placeholder {
      margin-left: 36px;
    }
  }
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  background-color: #21212d;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  border: 1px solid #6560ba5c;
  border-width: 0 0 1px 0 !important;
}
</style>

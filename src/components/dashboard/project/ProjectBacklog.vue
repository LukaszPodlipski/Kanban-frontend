<script setup lang="ts">
import useResizableTable from '@/composables/useResizableTable'
import { useLayoutStore } from '@/stores/layout'
import { useTasksStore } from '@/stores/tasks'
import { iTask } from '@/types/taskTypes'
import { formatDate, trimText } from '@/utils/functions'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import { computed, onBeforeMount } from 'vue'

const tasksStore = useTasksStore()
const layoutStore = useLayoutStore()

onBeforeMount(() => {
  if (!tasksStore.items.length) tasksStore.getItems()
})

const { tableHeight } = useResizableTable()

const backlogTasks = computed(() =>
  tasksStore.items.filter((task) => task.projectColumnId === null),
)

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
      :loading="tasksStore.loadingItems"
    >
      <Column field="" header=""></Column>
      <Column field="identifier" :header="$t('backlog.identifier')"></Column>
      <Column field="name" :header="$t('backlog.name')" sortable></Column>
      <Column field="description" :header="$t('backlog.description')">
        <template #body="{ data }">
          <span v-html="trimText(data.description, 52)"></span>
        </template>
      </Column>
      <Column
        field="assignee.fullName"
        :header="$t('backlog.assignee')"
        sortable
      >
        <template #body="{ data }">
          <div v-if="data.assignee" class="flex align-items-center">
            <img class="task__avatar mr-3" :src="data.assignee.avatarUrl" />
            <span>{{ data.assignee.fullName }}</span>
          </div>
          <span class="task__avatar--placeholder" v-else>{{
            $t('tasks.notAssigned')
          }}</span>
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
  border-left: 3px solid $grayscale-darken5;
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
  background-color: $grayscale-darken4;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  border: 1px solid $primary-base-opacity;
  border-width: 0 0 1px 0 !important;
}
</style>

<script setup lang="ts">
import TopbarTemplate from '../fragments/TopbarTemplate.vue'

import { useLayoutStore } from '@/stores/layout'
import { useTasksStore } from '@/stores/tasks'

const layoutStore = useLayoutStore()
const tasksStore = useTasksStore()

const openDialog = () => {
  layoutStore.openDialog({
    title: 'Add New Task',
    component: 'AddNewTaskDialog',
  })
}
</script>

<template>
  <TopbarTemplate>
    <template v-slot:title>
      <span>Backlog</span>
    </template>
    <template v-slot:right
      ><BaseButton
        label="Add New Task"
        icon="plus"
        :disabled="tasksStore.loading"
        @click="openDialog"
        class="mr-4"
      />
    </template>
  </TopbarTemplate>
</template>

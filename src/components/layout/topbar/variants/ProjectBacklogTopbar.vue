<script setup lang="ts">
import TopbarTemplate from '../fragments/TopbarTemplate.vue'
import ProjectMembers from '../fragments/ProjectMembers.vue'
import SettingsIcon from '@/components/icons/SettingsIcon.vue'
import BoardIcon from '@/components/icons/BoardIcon.vue'

import useProjectTopbarUtilities from '@/composables/useProjectTopbarUtilities.ts'

import { useTasksStore } from '@/stores/tasks'
import { useProjectStore } from '@/stores/project'

const tasksStore = useTasksStore()
const projectStore = useProjectStore()

const { filters, navigateToSettings, navigateToProject, openNewTaskDialog } = useProjectTopbarUtilities()

</script>

<template>
  <TopbarTemplate>
    <template v-slot:title>
      <span>Backlog</span>
    </template>
    <template v-slot:right>
      <ProjectMembers v-model:model-value="filters.assigneeIds" class="mr-4" />
      <BaseSearch
        v-model="filters.query"
        label="Search"
        :disabled="projectStore.loading"
        :loading="tasksStore.loading"
        class="mr-5"
      />
      <BaseButton
        label="Add New Task"
        icon="plus"
        :disabled="tasksStore.loading"
        @click="openNewTaskDialog"
        class="mr-5"
      />
      <div v-tooltip.bottom="'Board'" class="mr-4">
        <BoardIcon
          class="cursor-pointer"
          :size="24"
          color="#6560ba"
          @click="navigateToProject"
        />
      </div>
      <div v-tooltip.bottom="'Settings'">
        <SettingsIcon
          class="cursor-pointer"
          :size="26"
          color="#6560ba"
          @click="navigateToSettings"
        />
      </div>
    </template>
  </TopbarTemplate>
</template>

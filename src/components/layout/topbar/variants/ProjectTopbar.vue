<script setup lang="ts">
import { useProjectStore } from '@/stores/project'
import { useTasksStore } from '@/stores/tasks'

import ProjectMembers from '../fragments/ProjectMembers.vue'
import TopbarTemplate from '../fragments/TopbarTemplate.vue'

import SettingsIcon from '@/components/icons/SettingsIcon.vue'
import BacklogIcon from '@/components/icons/BacklogIcon.vue'

import useProjectTopbarUtilities from '@/composables/useProjectTopbarUtilities'

const projectStore = useProjectStore()
const tasksStore = useTasksStore()

const { filters, navigateToSettings, navigateToBacklog, openNewTaskDialog } =
  useProjectTopbarUtilities()
</script>

<template>
  <TopbarTemplate :loading="projectStore.loading">
    <template v-slot:title>
      <span>{{ projectStore.project?.name }}</span>
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
      <div v-tooltip.bottom="'Backlog'" class="mr-4">
        <BacklogIcon
          class="cursor-pointer"
          :size="24"
          color="#6560ba"
          @click="navigateToBacklog"
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

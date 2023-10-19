<script setup lang="ts">
import BoardIcon from '@/components/icons/BoardIcon.vue'
import SettingsIcon from '@/components/icons/SettingsIcon.vue'
import usePermittedUser from '@/composables/usePermittedUser.ts'
import useProjectTopbarUtilities from '@/composables/useProjectTopbarUtilities.ts'
import { useProjectStore } from '@/stores/project'
import { useTasksStore } from '@/stores/tasks'

import SelectProjectMembers from '../partials/SelectProjectMembers.vue'
import TopbarTemplate from '../TopbarTemplate.vue'

const tasksStore = useTasksStore()
const projectStore = useProjectStore()
const { isAdmin } = usePermittedUser()

const { filters, navigateToSettings, navigateToProject, openNewTaskDialog } =
  useProjectTopbarUtilities()
</script>

<template>
  <TopbarTemplate>
    <template v-slot:title>
      <span>{{ $t('backlog.title') }}</span>
    </template>
    <template v-slot:right>
      <SelectProjectMembers
        v-model:model-value="filters.assigneeIds"
        class="mr-4"
      />
      <BaseSearch
        v-model="filters.query"
        :label="$t('backlog.search')"
        :disabled="projectStore.loading"
        :loading="tasksStore.loading"
        class="mr-5"
      />
      <BaseButton
        :label="$t('backlog.addNewTask')"
        icon="plus"
        :disabled="tasksStore.loading || !isAdmin"
        @click="openNewTaskDialog"
        class="mr-5"
      />
      <div v-tooltip.bottom="$t('backlog.board')" class="mr-4">
        <BoardIcon
          class="cursor-pointer"
          :size="24"
          color="#6560ba"
          @click="navigateToProject"
        />
      </div>
      <div v-tooltip.bottom="$t('backlog.settings')">
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

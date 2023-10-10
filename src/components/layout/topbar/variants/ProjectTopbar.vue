<script setup lang="ts">
import { useProjectStore } from '@/stores/project'
import { useTasksStore } from '@/stores/tasks'

import ProjectMembers from '../fragments/ProjectMembers.vue'
import TopbarTemplate from '../fragments/TopbarTemplate.vue'

import SettingsIcon from '@/components/icons/SettingsIcon.vue'
import BacklogIcon from '@/components/icons/BacklogIcon.vue'

import useProjectTopbarUtilities from '@/composables/useProjectTopbarUtilities'
import usePermittedUser from '@/composables/usePermittedUser'

import { rolesColors } from '@/const'
import { computed } from 'vue'

const projectStore = useProjectStore()
const tasksStore = useTasksStore()

const { isEditor, userRole } = usePermittedUser()

const roleColor = computed(() => {
  return rolesColors[userRole.value as keyof typeof rolesColors] || '#6560ba'
})

const { filters, navigateToSettings, navigateToBacklog, openNewTaskDialog } =
  useProjectTopbarUtilities()
</script>

<template>
  <TopbarTemplate :loading="projectStore.loading">
    <template v-slot:title>
      <div class="flex align-items-start">
        <span>{{ projectStore.project?.name }}</span>
        <span class="user-role ml-2" :style="{ backgroundColor: roleColor }">{{
          userRole
        }}</span>
      </div>
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
        :disabled="tasksStore.loading || !isEditor"
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

<style scoped lang="scss">
.user-role {
  font-size: 12px;
  background-color: #6560ba;
  font-weight: 500;
  padding: 2px 4px;
  border-radius: 4px;
}
</style>

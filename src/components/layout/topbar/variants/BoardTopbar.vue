<script setup lang="ts">
import BacklogIcon from '@/components/icons/BacklogIcon.vue'
import SettingsIcon from '@/components/icons/SettingsIcon.vue'
import usePermittedUser from '@/composables/usePermittedUser'
import useProjectTopbarUtilities from '@/composables/useProjectTopbarUtilities'
import { rolesColors } from '@/const'
import { useProjectStore } from '@/stores/project'
import { useTasksStore } from '@/stores/tasks'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import SelectProjectMembers from '../partials/SelectProjectMembers.vue'
import TopbarTemplate from '../TopbarTemplate.vue'

const projectStore = useProjectStore()
const tasksStore = useTasksStore()

const { isEditor, userRole } = usePermittedUser()
const { t } = useI18n()

const translatedUserRole = computed<string>(() => {
  return userRole.value ? t(`roles.${userRole.value?.toLowerCase()}`) : ''
})
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
          translatedUserRole
        }}</span>
      </div>
    </template>
    <template v-slot:right>
      <SelectProjectMembers
        v-model:model-value="filters.assigneeIds"
        class="mr-4"
      />
      <BaseSearch
        v-model="filters.query"
        :label="$t('core.search')"
        :disabled="projectStore.loading"
        :loading="tasksStore.loadingItems"
        class="mr-5"
      />
      <BaseButton
        :label="$t('project.addNewTask')"
        icon="plus"
        :disabled="tasksStore.loadingItems || !isEditor"
        @click="openNewTaskDialog"
        class="mr-5"
      />
      <div v-tooltip.bottom="$t('project.backlog')" class="mr-4">
        <BacklogIcon
          class="cursor-pointer"
          :size="24"
          color="#6560ba"
          @click="navigateToBacklog"
        />
      </div>
      <div v-tooltip.bottom="$t('project.settings')">
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
  background-color: $primary-base;
  font-weight: 500;
  padding: 2px 4px;
  border-radius: 4px;
}
</style>

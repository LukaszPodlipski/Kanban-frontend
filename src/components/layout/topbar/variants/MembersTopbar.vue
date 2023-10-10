<script setup lang="ts">
import SettingsIcon from '@/components/icons/SettingsIcon.vue'
import BoardIcon from '@/components/icons/BoardIcon.vue'

import { useMembersStore } from '@/stores/members'
import { useLayoutStore } from '@/stores/layout'

import TopbarTemplate from '../fragments/TopbarTemplate.vue'

import useProjectTopbarUtilities from '@/composables/useProjectTopbarUtilities.ts'
import usePermittedUser from '@/composables/usePermittedUser.ts'

const { navigateToSettings, navigateToProject } = useProjectTopbarUtilities()
const { isAdmin } = usePermittedUser()

const layoutStore = useLayoutStore()

const openNewMemberDialog = () => {
  layoutStore.openDialog({
    title: 'Add New Member',
    component: 'AddNewMemberDialog',
    size: '600px',
  })
}

const membersStore = useMembersStore()
</script>

<template>
  <TopbarTemplate>
    <template v-slot:title>
      <span>Backlog</span>
    </template>
    <template v-slot:right>
      <BaseButton
        label="Add New Members"
        icon="plus"
        :disabled="membersStore.loading || !isAdmin"
        @click="openNewMemberDialog"
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

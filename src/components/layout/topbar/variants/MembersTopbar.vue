<script setup lang="ts">
import { useI18n } from 'vue-i18n'

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
const { t } = useI18n()

const openNewMemberDialog = () => {
  layoutStore.openDialog({
    title: t('members.addNewMembers'),
    component: 'AddNewMemberDialog',
    size: '600px',
  })
}

const membersStore = useMembersStore()
</script>

<template>
  <TopbarTemplate>
    <template v-slot:title>
      <span>{{ $t('members.title') }}</span>
    </template>
    <template v-slot:right>
      <BaseButton
        :label="$t('members.addNewMembers')"
        icon="plus"
        :disabled="membersStore.loading || !isAdmin"
        @click="openNewMemberDialog"
        class="mr-5"
      />
      <div v-tooltip.bottom="$t('members.board')" class="mr-4">
        <BoardIcon
          class="cursor-pointer"
          :size="24"
          color="#6560ba"
          @click="navigateToProject"
        />
      </div>
      <div v-tooltip.bottom="$t('members.settings')">
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

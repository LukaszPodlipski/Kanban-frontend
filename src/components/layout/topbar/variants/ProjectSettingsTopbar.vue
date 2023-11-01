<script setup lang="ts">
import BoardIcon from '@/components/icons/BoardIcon.vue'
import SettingsIcon from '@/components/icons/SettingsIcon.vue'
import useProjectTopbarUtilities from '@/composables/useProjectTopbarUtilities.ts'

import TopbarTemplate from '../TopbarTemplate.vue'

const { navigateToSettings, navigateToBoard } = useProjectTopbarUtilities()
</script>

<template>
  <TopbarTemplate>
    <template v-slot:title>
      <span>{{ $t('settings.title') }}</span>
    </template>
    <template v-slot:right>
      <div v-tooltip.bottom="$t('members.board')" class="mr-4">
        <BoardIcon
          class="cursor-pointer"
          :size="24"
          color="#6560ba"
          @click="navigateToBoard"
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

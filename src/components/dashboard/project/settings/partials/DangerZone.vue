<script setup lang="ts">
import usePermittedUser from '@/composables/usePermittedUser'
import { useLayoutStore } from '@/stores/layout'
import { useProjectStore } from '@/stores/project'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import SettingsSectionTemplate from './SettingsSectionTemplate.vue'

const projectStore = useProjectStore()
const layoutStore = useLayoutStore()
const { isOwner } = usePermittedUser()
const i18n = useI18n()

const isLoading = computed(() => projectStore.loading)

const openDeleteConfirmDialog = () => {
  layoutStore.openDialog({
    title: i18n.t('settings.dangerZone.deleteProject'),
    component: 'ConfirmProjectDeleteDialog',
  })
}
</script>

<template>
  <SettingsSectionTemplate :loading="isLoading">
    <template #header>
      <span class="title">{{ $t('settings.dangerZone.title') }}</span>
    </template>
    <template #content>
      <div class="flex p-4">
        <div
          v-tooltip.bottom="
            !isOwner ? $t('settings.dangerZone.notPermittedToDelete') : ''
          "
        >
          <BaseButton
            :label="$t('settings.dangerZone.deleteProject')"
            icon="exclamation-triangle"
            :disabled="isLoading || !isOwner"
            backgroundColor="#ED0000"
            hoverColor="#C90101"
            @click="openDeleteConfirmDialog"
          />
        </div>
      </div>
    </template>
  </SettingsSectionTemplate>
</template>

<style scoped lang="scss"></style>

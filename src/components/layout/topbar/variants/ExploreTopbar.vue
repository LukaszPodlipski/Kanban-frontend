<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useLayoutStore } from '@/stores/layout'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import TopbarTemplate from '../TopbarTemplate.vue'

const authStore = useAuthStore()
const layoutStore = useLayoutStore()
const router = useRouter()

const i18n = useI18n()

const user = computed(() => authStore.user)

const openNewProjectDialog = () => {
  layoutStore.openDialog({
    title: i18n.t('project.createNewProject'),
    component: 'CreateNewProjectDialog',
    size: '900px',
  })
}

const goToUserAccount = () => {
  router.push({ name: 'Account' })
}
</script>

<template>
  <TopbarTemplate>
    <template v-slot:title>
      <div class="flex align-items-center">
        <img :src="user.avatarUrl" class="user-avatar" />
        <span
          >{{ $t('explore.hello') }}! {{ user.name }} {{ user.surname }}</span
        >
      </div>
    </template>
    <template v-slot:right>
      <BaseButton
        :label="$t('explore.createNewBoard')"
        icon="plus"
        :disabled="authStore.loading"
        class="mr-4"
        @click="openNewProjectDialog"
      />
      <BaseButton
        :label="$t('explore.myAccount')"
        icon="user"
        :disabled="authStore.loading"
        @click="goToUserAccount"
      />
    </template>
  </TopbarTemplate>
</template>

<style scoped lang="scss">
.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 20%;
  margin-right: 20px;
  object-fit: cover;
}
</style>

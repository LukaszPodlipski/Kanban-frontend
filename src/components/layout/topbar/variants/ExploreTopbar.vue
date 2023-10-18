<script setup lang="ts">
import { computed } from 'vue'
import TopbarTemplate from '../fragments/TopbarTemplate.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
</script>

<template>
  <TopbarTemplate>
    <template v-slot:title>
      <div class="flex align-items-center">
        <img :src="user.avatarUrl" class="user-avatar" />
        <span>{{$t('explore.hello')}}! {{ user.name }} {{ user.surname }}</span>
      </div>
    </template>
    <template v-slot:right>
      <BaseButton
        :label="$t('explore.createNewBoard')"
        icon="plus"
        :disabled="authStore.loading"
        class="mr-4"
      />
      <BaseButton
        :label="$t('explore.myAccount')"
        icon="user"
        :disabled="authStore.loading"
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

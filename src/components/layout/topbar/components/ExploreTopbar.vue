<script setup lang="ts">
import { computed } from 'vue'
import TopbarTemplate from '../assets/TopbarTemplate.vue'
import stores from '@/stores'

const authStore = stores.useAuthStore()
const user = computed(() => authStore.user || {})
</script>

<template>
  <TopbarTemplate>
    <template v-slot:title>
      <div class="flex align-items-center">
        <img :src="user.avatarUrl" class="user-avatar" />
        <span>Hello! {{ user.name }} {{ user.surname }}</span>
      </div>
    </template>
    <template v-slot:right>
      <BaseButton
        label="Create new board"
        icon="plus"
        :disabled="authStore.loading"
        class="mr-4"
      />
      <BaseButton
        label="My account"
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

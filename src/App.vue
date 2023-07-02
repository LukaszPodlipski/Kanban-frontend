<script setup lang="ts">
import stores from '@/stores'
import { onBeforeMount } from 'vue'

const authStore = stores.useAuthStore()

onBeforeMount(() => {
  authStore.setAuth()
})
</script>

<template>
  <router-view />
</template>

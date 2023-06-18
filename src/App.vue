<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { onBeforeMount } from 'vue'
const authStore = useAuthStore()

onBeforeMount(async () => {
  await authStore.setAuth()
})
</script>

<template>
  <router-view />
</template>

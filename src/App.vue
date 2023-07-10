<script setup lang="ts">
import stores from '@/stores'
import { onBeforeMount } from 'vue'
import Dialog from '@/components/dialog/Dialog.vue'

const authStore = stores.useAuthStore()

onBeforeMount(() => {
  authStore.setAuth()
})
</script>

<template>
  <Dialog />
  <router-view />
</template>

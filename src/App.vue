<script setup lang="ts">
import stores from '@/stores'
import { onBeforeMount } from 'vue'
import Dialog from '@/components/dialog/Dialog.vue'
import Toast from 'primevue/toast';

const authStore = stores.useAuthStore()

onBeforeMount(() => {
  authStore.setAuth()
})
</script>

<template>
  <Dialog />
  <Toast position="bottom-center"/>
  <router-view />
</template>

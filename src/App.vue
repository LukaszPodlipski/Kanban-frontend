<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { onBeforeMount } from 'vue'
import Dialog from '@/components/dialog/Dialog.vue'
import Toast from 'primevue/toast'

const authStore = useAuthStore()

onBeforeMount(() => {
  authStore.setAuth()
})
</script>

<template>
  <Dialog />
  <Toast position="bottom-center" />
  <router-view />
</template>

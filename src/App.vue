<script setup lang="ts">
import Dialog from '@/components/layout/dialog/Dialog.vue'
import { useAuthStore } from '@/stores/auth'
import Toast from 'primevue/toast'
import { onBeforeMount } from 'vue'

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

<style>
@import './assets/styles/_variables.scss';
</style>

<script setup lang="ts">
import Sidebar from '@/components/layout/sidebar/SideBar.vue'
import Topbar from '@/components/layout/topbar/TopBar.vue'
import { useWebsocketStore } from '@/stores/websocket'
import { onBeforeMount, onUnmounted } from 'vue'

const websocketStore = useWebsocketStore()

onBeforeMount(() => {
  websocketStore.joinChannel('UserProjectsIndexChannel', {})
})

onUnmounted(() => {
  websocketStore.leaveChannel('UserProjectsIndexChannel')
})
</script>

<template>
  <div class="app-wrapper flex">
    <Sidebar />
    <div class="content-wrapper flex flex-column">
      <Topbar />
      <router-view />
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-wrapper {
  width: 100vw;
  max-width: 100vw;
  min-height: 100vh;
}
.content-wrapper {
  width: 100%;
  overflow-x: auto;
}
</style>

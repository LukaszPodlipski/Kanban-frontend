<script setup lang="ts">
import SideBar from '../components/layout/SideBar.vue'
import TopBar from '../components/layout/TopBar.vue'
</script>

<template>
  <div class="app-wrapper flex">
    <SideBar />
    <div class="content-wrapper flex flex-column">
      <TopBar />
      <router-view />
    </div>
    <div></div>
  </div>
</template>

<style scoped lang="scss">
.app-wrapper {
  width: 100vw;
  height: 100vh;
}
.content-wrapper {
  width: 100%;
  height: 100%;
}
</style>

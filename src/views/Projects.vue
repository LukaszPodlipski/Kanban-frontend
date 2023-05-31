<script setup lang="ts">
import SideBar from '../components/layout/SideBar.vue'
import TopBar from '../components/layout/TopBar.vue'
import ProjectsContentWrapper from '../components/layout/ProjectsContentWrapper.vue'
</script>

<template>
  <div class="app-wrapper flex">
    <SideBar />
    <div class="content-wrapper flex flex-column">
      <TopBar />
      <ProjectsContentWrapper>
        <router-view />
      </ProjectsContentWrapper>
    </div>
    <div></div>
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

<script setup lang="ts">
import SideBar from '@/components/layout/sidebar/SideBar.vue'
import Topbar from '@/components/layout/topbar/Topbar.vue'
import ProjectsContentWrapper from '@/components/table/project/ProjectsContentWrapper.vue'
</script>

<template>
  <div class="app-wrapper flex">
    <SideBar />
    <div class="content-wrapper flex flex-column">
      <Topbar />
      <ProjectsContentWrapper>
        <router-view />
      </ProjectsContentWrapper>
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

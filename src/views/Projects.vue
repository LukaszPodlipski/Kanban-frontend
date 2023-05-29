<script setup lang="ts">
import SideBar from '../components/layout/SideBar.vue'
</script>

<template>
  <div class="flex">
    <SideBar />
    <div>
      <router-view />
    </div>
  </div>
</template>

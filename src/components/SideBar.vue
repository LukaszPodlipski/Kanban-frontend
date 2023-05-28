<script setup lang="ts">
import { useProjectsStore } from '../stores/projects';

const projectsStore = useProjectsStore()
// import { ref } from 'vue'

// defineProps<{ msg: string }>()

// const count = ref(0)
</script>

<template>
  <div class='side-bar'>
    <div class='flex align-items-center p-5'>
       <img src="../assets/icons/hamburger.svg">
       <span class='side-bar__title ml-3'>Kanban</span>
    </div>
    <span class='side-bar__subtitle ml-5'>ALL BOARDS ({{ projectsStore.projects.length }})</span>
  </div>
</template>


<style scoped lang="scss">
.side-bar {
  width: 300px;
   height: 100vh;

  background-color: #2F2F3B;
  border: 3px solid #2F2F3B;;

  &__title {
    font-size: 32px;
    font-weight: 600;
    color: #DFDCFF;
  }

  &__subtitle {
    font-size: 14px;
    font-weight: 600;
    color: #a5a5a5;
  }
}
</style>

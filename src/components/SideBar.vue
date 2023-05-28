<script setup lang="ts">
import { useProjectsStore } from '../stores/projects';

const projectsStore = useProjectsStore()
// import { ref } from 'vue'

// defineProps<{ msg: string }>()

// const count = ref(0)
</script>

<template>
 <h1>Sidebar {{ projectsStore.projects.length }}</h1>
</template>

<style scoped>

</style>

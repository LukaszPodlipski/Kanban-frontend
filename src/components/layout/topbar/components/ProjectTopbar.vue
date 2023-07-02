<script setup lang="ts">
import { ref } from 'vue'
import stores from '@/stores'
import ProjectMembers from '../assets/ProjectMembers.vue'
import TopbarTemplate from '../assets/TopbarTemplate.vue'

const projectStore = stores.useProjectStore()
const tasksStore = stores.useTasksStore()
const searchQuery = ref<string>('')
</script>

<template>
  <TopbarTemplate :loading="projectStore.loading">
    <template v-slot:title>
      <span>{{ projectStore.project?.name }}</span>
    </template>
    <template v-slot:left>
      <ProjectMembers class="ml-4" />
    </template>
    <template v-slot:right>
      <BaseSearch
        v-model="searchQuery"
        label="Search"
        :disabled="projectStore.loading"
        :loading="tasksStore.loading"
        class="mr-4"
      />
      <BaseButton
        label="Add New Task"
        icon="plus"
        :disabled="tasksStore.loading"
        class="mr-4"
      />
      <i class="pi pi-cog" :style="{ color: '#6560ba', fontSize: '24px' }"></i>
    </template>
  </TopbarTemplate>
</template>

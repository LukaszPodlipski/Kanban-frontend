<script setup lang="ts">
import { useProjectStore } from '@/stores/project'
import { useWebsocketStore } from '@/stores/websocket'
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const projectStore = useProjectStore()
const websocketStore = useWebsocketStore()
const route = useRoute()

const projectId = computed(() => Number(route.params.id))

const channels = [
  'TasksIndexChannel',
  'ColumnsIndexChannel',
  'MembersIndexChannel',
  'ProjectIndexChannel',
]

const connectWSChannels = () => {
  channels.forEach((channel) => {
    websocketStore.joinChannel(channel, {
      projectId: projectId.value,
    })
  })
}

const disconnectWSChannels = () => {
  channels.forEach((channel) => {
    websocketStore.leaveChannel(channel)
  })
}

onMounted(async () => {
  connectWSChannels()
  if (!projectStore.projectData)
    await projectStore.getCompleteProject(projectId.value)
})

watch(
  () => route.params.id,
  () => {
    if (projectId.value) {
      projectStore.getCompleteProject(projectId.value)
      disconnectWSChannels()
      connectWSChannels()
    } else {
      disconnectWSChannels()
    }
  },
)

onUnmounted(() => {
  disconnectWSChannels()
  projectStore.clearSelectedProject()
})
</script>

<template>
  <router-view />
</template>

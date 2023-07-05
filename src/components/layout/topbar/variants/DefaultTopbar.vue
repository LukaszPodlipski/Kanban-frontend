<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const documentTitle = computed(() => route.meta.title)
</script>

<template>
  <p>{{ documentTitle }}</p>
</template>

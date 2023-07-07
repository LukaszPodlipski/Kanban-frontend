<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TopbarTemplate from '../fragments/TopbarTemplate.vue'

const route = useRoute()
const documentTitle = computed(() => route.meta.title)
</script>

<template>
  <TopbarTemplate>
    <template v-slot:title>
      <span>{{ documentTitle }}</span>
    </template>
  </TopbarTemplate>
</template>

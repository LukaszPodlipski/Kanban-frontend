<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import TopbarTemplate from '../TopbarTemplate.vue'

const { t } = useI18n()
const route = useRoute()
const documentTitle = computed(() => {
  const title = route.meta.title as string
  return t(`views.${title?.replace(' ', '_').toLowerCase()}`)
})
</script>

<template>
  <TopbarTemplate>
    <template v-slot:title>
      <span>{{ documentTitle }}</span>
    </template>
  </TopbarTemplate>
</template>

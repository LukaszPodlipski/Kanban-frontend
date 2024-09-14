<script setup lang="ts">
import usePermittedUser from '@/composables/usePermittedUser'
import { useColumnsStore } from '@/stores/columns'
import { useLayoutStore } from '@/stores/layout'
import { iColumn, Column as ProjectColumn } from '@/types/columnTypes'
import clonedeep from 'lodash.clonedeep'
import Divider from 'primevue/divider'
import { computed, onMounted, Ref, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { randomPastelColor } from '@/utils/functions'
import ProjectColumnsTableInput from '../inputs/ProjectColumnsTableInput.vue'
import SettingsSectionTemplate from './SettingsSectionTemplate.vue'

/* -------------------------------- USE REQUIRED COMPOSABLES --------------------------------- */
const columnsStore = useColumnsStore()
const layoutStore = useLayoutStore()

const { t } = useI18n()
const { isAdmin } = usePermittedUser()

/* ---------------------------------- INITIALIZE LOCAL DATA ---------------------------------- */
type settingColumn = iColumn & { toDelete?: boolean }

const initialColumns: Ref<settingColumn[]> = ref([])
const columns: Ref<settingColumn[]> = ref([])

const aggregatedErrors: Ref<Record<string, string | undefined>> = ref({})

/* -------------------------------- GET PROJECT COLUMNS ------------------------------------ */
onMounted(async () => {
  if (!columnsStore.items.length) await columnsStore.getItems()
  setColumnsValues()
})

/* ---------------------------------------- COMPUTED ------------------------------------------ */

const isLoading = computed(() => {
  return columnsStore.loadingItems
})

const isColumnsSectionValid = computed(() => {
  return (
    Object.values(aggregatedErrors.value).filter((value) => value !== undefined && value !== '')
      .length === 0
  )
})

const isChangeInColumns = computed(() => {
  return JSON.stringify(initialColumns.value) !== JSON.stringify(columns.value)
})

/* ---------------------------------------- FUNCTIONS ----------------------------------------- */
const setColumnsValues = () => {
  const columnsValue = columnsStore.items
    .map((column) => ({ ...column, toDelete: false }))
    .sort((a, b) => a.order - b.order)
  columns.value = clonedeep(columnsValue)
  initialColumns.value = clonedeep(columnsValue)
}

const restoreColumns = () => {
  columns.value = JSON.parse(JSON.stringify(initialColumns.value)) // deep clone
  aggregatedErrors.value = {}
}

const addNewColumn = () => {
  const newColumn = new ProjectColumn({
    id: new Date().getTime(),
    color: randomPastelColor(),
    order: columns.value.length + 1,
    isNew: true,
    name: '',
    type: null,
    description: '',
  })

  columns.value.push(newColumn)
}

const saveColumnsChanges = async () => {
  try {
    const payload = columns.value.map((column, index) => {
      return {
        ...column,
        color: column.color.startsWith('#') ? column.color : `#${column.color}`,
        order: index + 1,
        type: column.type,
        isNew: column.isNew || false,
      }
    })

    await columnsStore.updateItems(payload)
    layoutStore.showToast({
      message: t('settings.columns.columnsUpdateSuccess'),
      type: 'success',
    })

    await columnsStore.getItems()
    setColumnsValues()
  } catch (error) {
    console.log(error)
    layoutStore.showToast({
      message: t('settings.columns.columnsUpdateError'),
      type: 'error',
    })
  }
}
</script>

<template>
  <SettingsSectionTemplate :loading="columnsStore.loadingItems">
    <template #header>
      <span class="title">{{ $t('settings.columns.title') }}</span>
      <div class="flex gap-4">
        <BaseButton
          :label="$t('settings.columns.restoreInitialState')"
          icon="replay"
          :disabled="!isChangeInColumns || isLoading || !isAdmin"
          @click="restoreColumns"
        />
        <BaseButton
          :label="$t('settings.columns.saveChanges')"
          :icon="isColumnsSectionValid ? 'check' : 'times'"
          :disabled="
            !isColumnsSectionValid ||
            !isChangeInColumns ||
            isLoading ||
            !isAdmin
          "
          @click="saveColumnsChanges"
        />
        <Divider layout="vertical" class="p-0 m-0" />

        <BaseButton
          :label="$t('settings.columns.addNewColumn')"
          icon="plus"
          :disabled="isLoading || !isAdmin"
          @click="addNewColumn"
        />
      </div>
    </template>
    <template #content>
      <ProjectColumnsTableInput
        v-model:columns="columns"
        v-model:aggregated-errors="aggregatedErrors"
        isEditingColumns
      />
    </template>
  </SettingsSectionTemplate>
</template>

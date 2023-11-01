<script setup lang="ts">
import usePermittedUser from '@/composables/usePermittedUser'
import { columnTypes } from '@/const'
import { useColumnsStore } from '@/stores/columns'
import { useLayoutStore } from '@/stores/layout'
import { iColumn, Column as ProjectColumn } from '@/types/columnTypes'
import rules from '@/utils/validators'
import clonedeep from 'lodash.clonedeep'
import ColorPicker from 'primevue/colorpicker'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Divider from 'primevue/divider'
import { computed, onMounted, Ref, ref } from 'vue'
import { useI18n } from 'vue-i18n'

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

const refreshKey: Ref<number> = ref(0) // needed to refresh the table after reorder - quick fix
const aggregatedErrors: Ref<any> = ref({})

const editingRows = ref([])

/* -------------------------------- GET PROJECT COLUMNS ------------------------------------ */
onMounted(async () => {
  await columnsStore.getItems()
  setColumnsValues()
})

/* ---------------------------------------- COMPUTED ------------------------------------------ */
const tableColumns = computed(() => [
  { field: 'name', header: t('settings.columns.name') },
  { field: 'type', header: t('settings.columns.type') },
  { field: 'color', header: t('settings.columns.color') },
  { field: 'description', header: t('settings.columns.description') },
  { field: 'actions', header: t('settings.columns.actions') },
])

const isLoading = computed(() => {
  return columnsStore.loading
})

const isColumnsSectionValid = computed(() => {
  return (
    Object.values(aggregatedErrors.value).filter((value) => value !== undefined)
      .length === 0
  )
})

const isChangeInColumns = computed(() => {
  return JSON.stringify(initialColumns.value) !== JSON.stringify(columns.value)
})

const formattedColumnTypes = computed(() => {
  return columnTypes.map((type) => ({
    label: t(`columnTypes.${type}`),
    value: type,
    disabledOption: columns.value.some((column) => column.type === type),
  }))
})

/* ---------------------------------------- FUNCTIONS ----------------------------------------- */
const setColumnsValues = () => {
  const columnsValue = columnsStore.items
    .map((column) => ({ ...column, toDelete: false }))
    .sort((a, b) => a.order - b.order)
  columns.value = clonedeep(columnsValue)
  initialColumns.value = clonedeep(columnsValue)
}

const aggregateError = ({ key, value }: { key: string; value: string }) => {
  aggregatedErrors.value[key] = value
}

const restoreColumns = () => {
  columns.value = JSON.parse(JSON.stringify(initialColumns.value)) // deep clone
  aggregatedErrors.value = {}
  refreshKey.value += 1
}

const addNewColumn = () => {
  const newColumn = new ProjectColumn({
    id: new Date().getTime(),
    color: '#000000',
    order: columns.value.length + 1,
    isNew: true,
    name: '',
    type: null,
    description: '',
  })

  columns.value.push(newColumn)
}

const markColumnToDelete = (index: number) => {
  if (columns.value[index].isNew) {
    columns.value.splice(index, 1)
    return
  }
  columns.value[index].toDelete = !columns.value[index].toDelete
}

const updateLocalColumnsByReorder = (newColumns: any) => {
  columns.value = newColumns.value
}

const checkDeleteState = (column: any) => {
  return column?.toDelete && 'background-color: #6b1a2b'
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
  <SettingsSectionTemplate>
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
      <DataTable
        v-model:editingRows="editingRows"
        :value="columns"
        :reorderableColumns="true"
        editMode="cell"
        dataKey="field"
        :disabled="!isAdmin"
        @rowReorder="updateLocalColumnsByReorder"
        :loading="isLoading"
        tableClass="editable-cells-table"
        :rowStyle="checkDeleteState"
        tableStyle="min-width: 50rem"
      >
        <Column
          rowReorder
          headerStyle="width: 4rem"
          bodyStyle="text-align: center"
          :reorderableColumn="true"
        />

        <Column
          v-for="col of tableColumns"
          :field="col.field"
          :header="col.header"
          :key="col.field"
          :bodyStyle="
            ['actions', 'color'].includes(col.field) && 'text-align: center'
          "
          rowReorder
        >
          <template v-if="col.field === 'name'" #body="{ data, index }">
            <div class="column__name">
              <BaseInput
                v-model="columns[index][col.field]"
                :fieldName="`column-name-${data.id}`"
                :disabled="!isAdmin"
                medium
                hideDetails
                emitErrors
                validateOnCreate
                disableOutline
                @onErrorChange="aggregateError"
                :rules="[(value:string) => rules.required(value,'Name')]"
              />
            </div>
          </template>
          <template v-if="col.field === 'type'" #body="{ data }">
            <div class="column__type flex">
              <BaseSelect
                v-model="data.type"
                :items="formattedColumnTypes"
                :disabled="!isAdmin"
                optionsLabel="label"
                optionsValue="value"
                disableOutline
                :label="$t('settings.columns.columnType')"
                :placeholder="$t('settings.columns.columnType')"
              />
            </div>
          </template>
          <template v-if="col.field === 'color'" #body="{ data }">
            <ColorPicker v-model="data.color" />
          </template>
          <template v-if="col.field === 'description'" #body="{ data, index }">
            <div class="column__description align-items-center">
              <span>{{
                data.description || $t('settings.columns.noDescription')
              }}</span>
              <BaseDialogTextarea
                :header="$t('settings.columns.editDescription')"
                v-model="columns[index][col.field]"
              >
                <template #trigger="{ openDialog }">
                  <BaseButton
                    v-tooltip.bottom="$t('settings.columns.editDescription')"
                    class="ml-2"
                    icon="pencil"
                    small
                    :disabled="isLoading || !isAdmin"
                    @click="openDialog"
                  />
                </template>
              </BaseDialogTextarea>
            </div>
          </template>
          <template v-if="col.field === 'actions'" #body="{ index }">
            <i
              class="pi pi-trash justify-self-center cursor-pointer"
              @click="markColumnToDelete(index)"
            ></i>
          </template>
        </Column>
      </DataTable>
    </template>
  </SettingsSectionTemplate>
</template>

<style scoped lang="scss">
.columns-headers {
  display: grid;
  align-items: center;
  grid-template-columns: 50px 150px 250px 100px 300px 50px;
  gap: 30px;
}

.column {
  display: grid;
  align-items: center;
  grid-template-columns: 50px 150px 250px 100px 300px 50px;
  gap: 30px;
  border-top: 2px solid #2c2c38;
  background-color: #21212d;

  &__to-delete {
    background-color: #6b1a2b;
  }

  &__description {
    display: grid;
    grid-template-columns: 1fr 50px;
    span {
      max-width: 400px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}

.justify-self-center {
  justify-self: center;
}

:deep(.p-inputtext:not(.p-colorpicker-preview):not(.p-inputtextarea)) {
  height: 35px !important;
  padding: 0.45rem 1.8rem 0.45rem 0.75rem !important;
}
</style>

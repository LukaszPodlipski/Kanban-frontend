<script setup lang="ts">
import usePermittedUser from '@/composables/usePermittedUser'
import { columnTypes } from '@/const'
import { iColumn } from '@/types/columnTypes'
import rules from '@/utils/validators'
import ColorPicker from 'primevue/colorpicker'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { isAdmin } = usePermittedUser()

const editingRows = ref([])

type settingColumn = iColumn & { toDelete?: boolean }

const emit = defineEmits(['update:columns', 'update:aggregated-errors'])

const props = defineProps({
  columns: {
    type: Array as () => settingColumn[],
    default: () => [],
  },
  aggregatedErrors: {
    type: Object,
    default: () => ({}),
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  isEditingColumns: {
    type: Boolean,
    default: false,
  },
})
const tableColumns = computed(() =>
  [
    {
      field: 'name',
      header: t('settings.columns.name'),
      onlyEditingMode: false,
      width: 200,
      align: 'left',
    },
    {
      field: 'type',
      header: t('settings.columns.type'),
      onlyEditingMode: true,
      width: 250,
      align: 'left',
    },
    {
      field: 'color',
      header: t('settings.columns.color'),
      onlyEditingMode: false,
      width: 100,
      align: 'center',
    },
    {
      field: 'description',
      header: t('settings.columns.description'),
      onlyEditingMode: true,
      width: 300,
      align: 'left',
    },
    {
      field: 'actions',
      header: t('settings.columns.actions'),
      onlyEditingMode: false,
      width: 50,
      align: 'center',
    },
  ].filter((col) => (props.isEditingColumns ? true : !col.onlyEditingMode)),
)

const formattedColumnTypes = computed(() => {
  return columnTypes.map((type) => ({
    label: t(`columnTypes.${type}`),
    value: type,
    disabledOption: props.columns.some((column) => column.type === type),
  }))
})

const checkDeleteState = (column: any) => {
  return column?.toDelete && 'background-color: #6b1a2b'
}

const markColumnToDelete = (index: number) => {
  const columns = props.columns
  if (columns[index].isNew || !props.isEditingColumns) {
    // remove all errors related to the new column
    const errors = props.aggregatedErrors
    Object.keys(errors).map((key) => {
      const id = key.split('#')[1]
      if (id === columns[index]?.id?.toString()) delete errors[key]
    })
    emit('update:aggregated-errors', { ...errors })
    // remove the new column
    columns.splice(index, 1)
    return
  } else columns[index].toDelete = !columns[index].toDelete
  emit('update:columns', columns)
}

const aggregateError = ({ key, value }: { key: string; value: string }) => {
  const errors = { ...props.aggregatedErrors }
  errors[key] = value
  emit('update:aggregated-errors', { ...errors })
}
</script>

<template>
  <DataTable
    v-model:editingRows="editingRows"
    :value="columns"
    editMode="cell"
    dataKey="field"
    :disabled="!isAdmin"
    :columWidths="[50, 50, 50]"
    :loading="isLoading"
    tableClass="editable-cells-table"
    :rowStyle="checkDeleteState"
    tableStyle="min-width: 50rem"
    :resizableColumns="false"
    frozen
    emptyMessage="Brak kolumn"
    @rowReorder="$emit('update:columns', $event.value)"
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
      :resizableColumn="false"
      :key="col.field"
      :headerStyle="{
        width: col.width + 'px !important',
        textAlign: `${col.align} !important`,
      }"
      :bodyStyle="
        ['actions', 'color'].includes(col.field) && 'text-align: center'
      "
      rowReorder
    >
      <template v-if="col.field === 'name'" #body="{ data, index }">
        <div class="column__name">
          <BaseInput
            v-model="columns[index][col.field]"
            :fieldName="`column-name#${data.id}`"
            :disabled="isEditingColumns && !isAdmin"
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
          class="pi pi-trash cursor-pointer"
          :class="{
            'pi-trash': !columns[index].toDelete,
            'pi-times': columns[index].toDelete,
          }"
          @click="markColumnToDelete(index)"
        ></i>
      </template>
    </Column>
    <template #empty>
      <span class="column__empty"
        >{{ $t('settings.columns.noColumns') }}</span
      >
    </template>
  </DataTable>
</template>

<style scoped lang="scss">
.columns-headers {
  display: grid;
  align-items: center;
  gap: 30px;
}

.column {
  display: grid;
  align-items: center;
  gap: 30px;
  border-top: 2px solid $grayscale-darken3;
  background-color: $grayscale-darken4;

  &__to-delete {
    background-color: $error-color-darken;
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

  &__empty {
    margin-left: 130px;
    color: $primary-base;
  }
}

.justify-self-center {
  justify-self: center;
}

:deep(.p-inputtext:not(.p-colorpicker-preview):not(.p-inputtextarea)) {
  height: 35px !important;
  padding: 0.45rem 1.8rem 0.45rem 0.75rem !important;
}

:deep(.p-column-header-content) {
  display: block !important;
}
</style>

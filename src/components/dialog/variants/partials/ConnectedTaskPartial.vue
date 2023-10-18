<script setup lang="ts">
import { relations } from '@/const'
import { useTasksStore } from '@/stores/tasks'
import { iSimplifiedTask, iTask } from '@/types/taskTypes'
import { trimText } from '@/utils/functions'
import rules from '@/utils/validators'
import { Form } from 'vee-validate'
import { computed, PropType } from 'vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits([
  'setEditingState',
  'updateRelation',
  'updateValue',
  'deleteRelation',
  'openRelatedTaskDialog',
])

const props = defineProps({
  taskHasRelation: {
    type: Boolean,
    default: false,
  },
  relationId: {
    type: Number as PropType<number | null>,
    default: null,
  },
  relationMode: {
    type: String as PropType<string | null>,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  dialogItem: {
    type: Object,
    default: () => ({}),
  },
  task: {
    type: Object as () => iTask,
    default: () => ({}),
  },
  relatedTask: {
    type: Object as () => iSimplifiedTask | null,
    default: () => ({}),
  },
})

const { t } = useI18n()
const tasksStore = useTasksStore()

const relatedTasksOptions = computed(() => {
  return tasksStore.items
    .filter((item) => item.id !== props.task.id)
    .map((task: iSimplifiedTask) => {
      const assiggnee = task.assignee?.fullName
        ? ` - ${task.assignee?.fullName || ''}`
        : ''
      return {
        label: `${task.identifier}: ${trimText(task.name, 15)} ${trimText(
          assiggnee,
          15,
        )}`,
        id: task.id,
      }
    })
})

const setRelationEditingState = () => {
  if (props.isEditing) {
    emit('updateValue', { key: 'relationMode', value: '' })
    emit('updateValue', { key: 'relationId', value: null })
    emit('setEditingState', { key: 'relation', value: false })
  } else {
    emit('setEditingState', { key: 'relation', value: true })
  }
}

const translateRelation = (relationName: string, fallbackName: string = '') => {
  return relationName
    ? t(`relations.${relationName.toLowerCase().replace(' ', '_')}`)
    : fallbackName
}
</script>

<template>
  <div class="flex justify-content-between align-items-center p-2 mt-2">
    <span class="label">{{ $t('tasks.connectedTask') }}</span>
    <i
      v-if="!taskHasRelation || (!taskHasRelation && !disabled)"
      class="pi cursor-pointer"
      :class="{
        'pi-plus': !isEditing,
        'pi-times': isEditing,
      }"
      style="font-size: 0.8rem"
      @click.native="setRelationEditingState"
    ></i>
  </div>

  <Form v-if="isEditing" v-slot="{ resetField, errors }">
    <div class="flex gap-2 px-2 mt-1">
      <div
        class="flex flex-column justify-content-center"
        :style="{ width: '140px !important' }"
      >
        <BaseSelect
          :value="relationMode"
          :items="relations"
          label="RelationMode"
          fieldName="relationMode"
          :placeholder="$t('tasks.type')"
          :hide-dropdown-icon="true"
          :rules="[(value:string) => relationId ? rules.required(value,$t('tasks.relation')) : true]"
          @cleared="!relationId ? resetField('relatedTaskField') : null"
          @update:modelValue="(value:number) => $emit('updateValue', { key: 'relationMode', value })"
        >
          <template #value="{ slotProps }">
            {{ translateRelation(slotProps.value, $t('tasks.type')) }}</template
          >
          <template #option="{ slotProps }">
            {{
              translateRelation(slotProps.option, $t('tasks.type'))
            }}</template
          >
        </BaseSelect>
      </div>
      <div
        class="flex flex-column flex-1 justify-content-center"
        style="max-width: 355px; min-width: 355px; width: 355px"
      >
        <BaseSelect
          :value="relationId"
          :items="relatedTasksOptions"
          label="RelatedTask"
          fieldName="relatedTask"
          optionsValue="id"
          optionsLabel="label"
          :placeholder="
            $t('tasks.selectXtask', {
              type: relationMode ? `'${translateRelation(relationMode as string).toLowerCase()}'` : '',
            })
          "
          :rules="[(value:string) => relationMode ? rules.required(value,'Related task') : true]"
          @cleared="!relationMode ? resetField('relationModeField') : null"
          @update:modelValue="(value:number) => $emit('updateValue', { key: 'relationId', value })"
        />
      </div>
      <div class="flex justify-content-center">
        <BaseButton
          icon="check"
          medium
          :disabled="
            Object.keys(errors).length > 0 || !relationId || !relationMode
          "
          @click="$emit('updateRelation')"
        />
      </div>
    </div>
  </Form>

  <div
    v-if="task.relationId"
    class="field-hover relation flex justify-content-between align-items-center p-2 ml-2"
    @click="
      $emit('openRelatedTaskDialog', {
        taskId: task.relationId,
        redirected: true,
      })
    "
  >
    <span>{{ translateRelation(task.relationMode as string) }}</span>
    <div class="flex align-items-center justify-content-center">
      <span class="mr-2">{{ relatedTask?.identifier }} / </span>
      <span v-tooltip.bottom="relatedTask?.name" class="mr-2">{{
        trimText(relatedTask?.name, 20)
      }}</span>
      <span>{{ trimText(relatedTask?.assignee?.fullName, 20) }}</span>
      <i
        v-if="!disabled"
        v-tooltip.bottom="$t('tasks.deleteRelation')"
        class="pi pi-times ml-4"
        style="font-size: 0.8rem"
        @click.stop="$emit('deleteRelation')"
      ></i>
    </div>
  </div>
</template>

<style scoped lang="scss">
.label {
  font-size: 14px;
  font-weight: 600;
}

.field-hover {
  &:hover {
    background-color: #2424307c;
    cursor: pointer;
  }
}

.relation {
  border: 1px solid #6460ba6d;
}

:deep(.p-dropdown-label) {
  padding-right: 20px !important;
}
</style>

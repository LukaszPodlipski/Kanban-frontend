<script setup lang="ts">
import usePermittedUser from '@/composables/usePermittedUser'
import rules from '@/utils/validators'
import { computed } from 'vue'

const { isAdmin } = usePermittedUser()

const props = defineProps({
  name: String,
  description: String,
  prefix: String,
  isEditing: {
    type: Boolean,
    default: false,
  },
})

const disabled = computed(() => {
  return props.isEditing ? !isAdmin.value : false
})

defineEmits(['update:name', 'update:description', 'update:prefix'])
</script>

<template>
  <div class="content flex flex-wrap column-gap-5 rpw-gap-2">
    <div class="flex flex-column" style="min-width: 265px">
      <span class="field-label">{{ $t('settings.projectData.name') }}</span>
      <BaseInput
        :value="name"
        :label="$t('tasks.name')"
        :placeholder="$t('settings.projectData.enterProjectName')"
        :floatLabel="false"
        :disabled="disabled"
        medium
        disableOutline
        :rules="[(value:string) => rules.required(value, $t('settings.projectData.name')),(value:string) => rules.minLength(value,3,$t('settings.projectData.name')), (value:string) => rules.maxLength(value,20,$t('settings.projectData.name'))]"
        @update:modelValue="$emit('update:name', $event)"
      />
    </div>
    <div class="flex flex-column flex-grow-1">
      <span class="field-label">{{
        $t('settings.projectData.description')
      }}</span>
      <BaseInput
        :value="description"
        :label="$t('settings.projectData.description')"
        :placeholder="$t('settings.projectData.enterProjectDescription')"
        :floatLabel="false"
        :disabled="disabled"
        medium
        disableOutline
        :rules="[(value:string) => rules.maxLength(value,100,$t('settings.projectData.description'))]"
        @update:modelValue="$emit('update:description', $event)"
      />
    </div>
    <div
      class="flex flex-column"
      style="height: fit-content"
      v-tooltip.bottom="
        isEditing && $t('settings.projectData.prefixEditingWarning')
      "
    >
      <span class="field-label">{{ $t('settings.projectData.prefix') }}</span>
      <BaseInput
        :value="prefix"
        fieldName="prefix"
        :label="$t('settings.projectData.prefix')"
        :placeholder="$t('settings.projectData.enterProjectPrefix')"
        :floatLabel="false"
        :disabled="disabled || isEditing"
        medium
        :hide-details="isEditing"
        disableOutline
        :rules="[(value:string) => rules.required(value,$t('settings.projectData.prefix')), (value:string) => rules.maxLength(value,3,$t('settings.projectData.prefix'))]"
        @update:modelValue="$emit('update:prefix', $event)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.p-inputtext:not(.p-colorpicker-preview):not(.p-inputtextarea)) {
  height: 40px !important;
}
.field-label {
  margin-bottom: 8px;
}

.content {
  background-color: $grayscale-darken3;
}
</style>

<script setup lang="ts">
import usePermittedUser from '@/composables/usePermittedUser'
import { useAuthStore } from '@/stores/auth'
import rules from '@/utils/validators'
import Editor from 'primevue/editor'
import { computed } from 'vue'

const emit = defineEmits([
  'setEditingState',
  'updateValue',
  'submitValue',
  'showCommentInput',
])

const props = defineProps({
  value: {
    type: String,
    default: null,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
})
const { isViewer } = usePermittedUser()

type emitValueType = {
  key: string
  value: string
}

type emitEditingStateType = {
  key: string
  value: boolean
}

const authStore = useAuthStore()

const formatedValue = computed(() => {
  return props.value.replace(/<p><br><\/p>/g, '')
})

const commentHasNoValue = computed(() => {
  const noSpacesValue = formatedValue.value.replace(/ /g, '')
  const emptyCommentPattern = /<p><\/p>(<p><\/p>)*$/
  return emptyCommentPattern.test(noSpacesValue)
})

const submitValueOnEnterKeyup = () => {
  if (formatedValue.value && !commentHasNoValue.value) {
    emit('submitValue', props.value)
  }
}
</script>

<template>
  <div class="comment-input-wrapper flex align-items-start">
    <img
      :src="authStore.user.avatarUrl"
      class="comment-input-wrapper__avatar mr-3"
    />
    <div class="w-full">
      <BaseDoubleClickInput
        :value="value"
        :isEditing="isEditing"
        :disabled="isViewer || !formatedValue || commentHasNoValue"
        valueKey="comment"
        :label="$t('tasks.comment')"
        :placeholder="$t('tasks.addNewComment')"
        :maxLength="1000"
        dense
        :component="Editor"
        :tooltipConfig="{
          value: $t('tasks.dblClickToComment'),
          showDelay: 500,
        }"
        :rules="[(value:string) => rules.maxLength(value, 1000, $t('tasks.comment'))]"
        @setEditingState="(value: emitEditingStateType) => $emit('setEditingState', value)"
        @updateValue="(value: emitValueType) => $emit('updateValue', value)"
        @submitValue="(value: string) => $emit('submitValue', value)"
        @onEnterKeyup="submitValueOnEnterKeyup"
      >
        <div
          class="comment-input-wrapper__placeholder flex-1"
          :class="{ 'not-permitted': isViewer }"
          @dblclick="$emit('showCommentInput')"
        >
          <span>{{ $t('tasks.addNewComment') }}</span>
        </div>
      </BaseDoubleClickInput>
    </div>
  </div>
</template>

<style scoped lang="scss">
.comment-input-wrapper {
  &__placeholder {
    font-size: 12px !important;
    font-weight: 400;
    background-color: #23232f;
    border-radius: 4px;
    padding: 10px 16px;
    width: 100%;
    cursor: pointer;
  }
  &__avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
}
</style>

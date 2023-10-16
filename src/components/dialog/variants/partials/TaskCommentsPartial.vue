<script setup lang="ts">
import { ref } from 'vue';
import { iComment } from '@/types/taskTypes'


const childRef = ref(null)
defineExpose({ childRef })

defineProps({
  comments: {
    type: Array as () => iComment[],
    required: true,
  },
})
</script>

<template>
  <div ref='childRef' class="comments-wrapper mb-2">
    <div
      v-for="comment in comments"
      :key="comment.id"
      class="comment flex mb-2 align-items-start"
    >
      <img :src="comment.user.avatarUrl" class="comment__avatar mr-3" />
      <div class="comment__content flex flex-column py-2 px-3">
        <span class="comment__user">{{ comment.user?.fullName }}</span>
        <span v-html="comment.content" class="comment__text mt-1" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.comments-wrapper {
  max-height: 200px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 5px;
    height: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #6560ba;
  }

  &::-webkit-scrollbar-track {
    background: #2f2f3b;
  }
}

.comment {
  &__content {
    background-color: #23232f;
    border-radius: 8px;
  }
  &__avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  &__user {
    font-size: 12px;
    font-weight: 600;
  }
  &__text {
    font-size: 14px;
  }
}
</style>

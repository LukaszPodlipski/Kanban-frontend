<script setup lang="ts">
defineProps({
  color: {
    type: String,
    default: '#DFDCFF',
  },
  size: {
    type: Number,
    default: 20,
  },
})
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 21 19" fill="none">
    <path
      d="M18.1667 18.125H2.83341C1.77487 18.125 0.916748 17.2669 0.916748 16.2083V2.79167C0.916748 1.73312 1.77487 0.875 2.83341 0.875H18.1667C19.2253 0.875 20.0834 1.73312 20.0834 2.79167V16.2083C20.0834 17.2669 19.2253 18.125 18.1667 18.125ZM8.58342 4.70833V16.2083H18.1667V4.70833H8.58342ZM2.83341 4.70833V16.2083H6.66675V4.70833H2.83341Z"
      :fill="color"
    />
  </svg>
</template>

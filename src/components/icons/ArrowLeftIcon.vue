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
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C19.9939 15.5203 15.5203 19.9939 10 20ZM10 2C5.6054 2.00111 2.03446 5.54686 2.00224 9.94135C1.97002 14.3358 5.48858 17.9336 9.88269 17.9991C14.2768 18.0647 17.9011 14.5735 18 10.18V11.963V10C17.995 5.58378 14.4162 2.00496 10 2ZM11.45 14.9L6.5 9.95L11.45 5L12.864 6.414L9.328 9.95L12.863 13.486L11.451 14.9H11.45Z"
      :fill="color"
    />
  </svg>
</template>

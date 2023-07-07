<script setup lang="ts">
defineProps({
  color: {
    type: String,
    default: '#DFDCFF',
  },
})
</script>

<template>
  <svg
    width="18"
    height="10"
    viewBox="0 0 18 10"
    fill="none"
  >
    <path
      d="M0.514893 1.46495L8.99989 9.94995L17.4849 1.46495L16.0709 0.0499516L8.99989 7.12195L1.92889 0.0499516L0.514893 1.46495Z"
      :fill="color"
    />
  </svg>
</template>

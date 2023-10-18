<script setup lang="ts">
defineProps({
  color: {
    type: String,
    default: '#DFDCFF',
  },
})
</script>

<template>
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M18 18H10V12H18V18ZM8 18H0V8H8V18ZM18 10H10V0H18V10ZM8 6H0V0H8V6Z"
      :fill="color"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps({
  color: {
    type: String,
    default: '#DFDCFF',
  },
})
</script>

<template>
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M10 20C4.47967 19.9939 0.00606237 15.5203 0 10V9.8C0.109931 4.30453 4.63459 -0.072041 10.1307 0.000882959C15.6268 0.0738069 20.0337 4.56889 19.9978 10.0653C19.9619 15.5618 15.4966 19.9989 10 20ZM10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C17.995 5.58378 14.4162 2.00496 10 2ZM8.55 15L7.136 13.585L10.671 10.05L7.136 6.515L8.55 5.1L13.5 10.05L8.551 15H8.55Z"
      :fill="color"
    />
  </svg>
</template>

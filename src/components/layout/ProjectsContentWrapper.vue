<template>
  <div class="content-wrapper">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.content-wrapper {
  width: 100%;
  height: 100%;
  padding: 32px;
  background-color: #2c2c38;
  border-bottom: 3px solid #2f2f3b;
  border-left: 3px solid #2f2f3b;
}
</style>

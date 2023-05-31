<template>
  <div class="projects-wrapper">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.projects-wrapper {
  width: 100%;
  height: 100%;
  max-height: calc(100vh - 80px);
  overflow-y: scroll;
  padding: 0 32px 32px 32px;
  background-color: #21212d;
  border-bottom: 3px solid #2f2f3b;
  border-left: 3px solid #2f2f3b;

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #6560ba;
  }

  &::-webkit-scrollbar-track {
    background: #2f2f3b;
  }
}
</style>

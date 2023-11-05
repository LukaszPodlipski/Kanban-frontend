<template>
  <div class="section">
    <div
      v-if="$slots.header"
      class="header flex align-items-center justify-content-between"
    >
      <slot name="header"></slot>
    </div>
    <div v-if="$slots.subHeader" class="sub-header px-4 py-2">
      <slot name="subHeader"></slot>
    </div>
    <div v-if="$slots.content" class="content flex flex-column">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.section {
  color: $primary-lighten;
  border: 2px solid $primary-darken2;
  border-radius: 4px;
}

.header {
  padding: 16px 32px;
  background-color: $grayscale-darken3;
  border-bottom: $grayscale-darken5;
  font-size: 22px;
  font-weight: 600;
}

.content {
  border-top: 1px solid $primary-base;
}

.sub-header {
  background-color: $grayscale-darken3;
}
</style>

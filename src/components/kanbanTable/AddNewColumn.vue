<template>
  <div
    class="add-column flex align-items-center justify-content-center my-6 mr-5"
  >
    <div class="flex">
      <i class="pi pi-plus mr-2" style="font-size: 1rem"></i>
      <span>Add new column</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.add-column {
  height: 90%;
  width: 284px;
  min-width: 284px;
  background-color: #23232f;
  border-radius: 8px;
  color: #70727f;
  transition: 0.3s;

  &:hover {
    cursor: pointer;
    background-color: #2c2c38;
  }
}
</style>

<script setup lang="ts">
import draggable from 'vuedraggable'

import { useRoute } from 'vue-router'
import { computed, onMounted, onUnmounted, watch, reactive } from 'vue'
import { useSingleProjectStore } from '../stores/singleProject'

const singleProjectStore = useSingleProjectStore()
const route = useRoute()
const id = computed(() => Number(route.params.id))
const project = reactive({ columns: [{ tasks: [] }, { tasks: [] }] })

watch(id, async () => {
  if (id.value)
    await singleProjectStore.setSelectedProject(id.value).then(() => {
      Object.assign(project, singleProjectStore.project)
    })
})

onMounted(async () => {
  await singleProjectStore.setSelectedProject(id.value).then(() => {
    Object.assign(project, singleProjectStore.project)
  })
})

onUnmounted(() => {
  singleProjectStore.clearSelectedProject()
})
</script>

<template>
  <div class="flex h-full flex-column relative">
    <div class="flex columns-wrapper mt-5">
      <div v-for="(column, index) in project.columns" class="column mr-5">
        <div class="header mb-4">
          <div
            class="header__color-circle mr-3"
            :style="{ backgroundColor: column.color }"
          ></div>
          <span v-if="column?.name" class="header__name mr-5"
            >{{ column.name }} ({{ column.tasks.length }})</span
          >
        </div>
        <draggable
          v-model="column[index]"
          group="tasks"
          item-key="id"
          class="h-full mt-6"
          :list="column.tasks"
        >
          <template #item="{ element }">
            <div class="task__tile flex flex-column mb-4">
              <span class="task__title mb-1">{{ element.name }}</span>
              <span class="task__description">{{ element.description }}</span>
            </div>
          </template>
        </draggable>
      </div>
      <div
        class="add-column flex align-items-center justify-content-center my-6 mr-5"
      >
        <div class="flex">
          <i class="pi pi-plus mr-2" style="font-size: 1rem"></i>
          <span>Add new column</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.columns-wrapper {
  height: 100%;
  position: relative;
}

.header {
  position: fixed;
  width: 284px;

  &__name {
    font-weight: 600;
    text-transform: uppercase;
    font-size: 14px;
    letter-spacing: 0.12em;
    color: #6560ba;
    display: inline-block;
  }

  &__color-circle {
    width: 17px;
    height: 17px;
    border-radius: 50%;
    display: inline-block;
  }

  &::before {
    content: '';
    top: -32px;
    position: absolute;
    display: inline-block;
    width: 284px;
    height: 80px;
    background: #21212d;
    z-index: -1;
  }
}

.column {
  min-height: 300px;
  width: 284px;
  min-width: 284px;
}

.task {
  &__tile {
    min-height: 90px;
    width: 100%;
    background-color: #2c2c38;
    border-radius: 8px;
    padding: 24px;
    cursor: pointer;
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: #dfdcff;
  }

  &__description {
    font-size: 12px;
    color: #7e828e;
  }
}

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

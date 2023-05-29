<script setup lang="ts">
import { computed } from 'vue'
import router from '../../router'
import ProjectIcon from '../icons/ProjectIcon.vue'

import { useProjectsStore } from '../../stores/projects'
import { useSingleProjectStore } from '../../stores/singleProject'
import { useLayoutStore } from '../../stores/layout'

const projectsStore = useProjectsStore()
const singleProjectStore = useSingleProjectStore()
const layoutStore = useLayoutStore()

const fullSideBar = computed(() => layoutStore.sideBarOpened)

const selectProject = (project: any) => {
  if (singleProjectStore.loading) return
  router.push({ name: 'SingleProject', params: { id: project.id } })
}

const formatItemName = (name: string) => {
  return fullSideBar.value ? name : name.slice(0, 3).toUpperCase()
}
</script>

<template>
  <div class="side-bar" :class="{ 'side-bar--mini': !fullSideBar }">
    <div class="side-bar__hamburger flex align-items-center p-5">
      <img
        src="../../assets/icons/hamburger.svg"
        class="cursor-pointer"
        :class="{ 'rotate-90': !fullSideBar }"
        @click="layoutStore.changeSideBarStatus"
      />
      <span v-if="fullSideBar" class="side-bar__title ml-3">Kanban</span>
    </div>

    <div class="content flex flex-column">
      <div
        class="px-4 flex flex-shrink-1"
        :class="{ 'align-self-center': !fullSideBar }"
      >
        <span v-if="fullSideBar" class="content__title">ALL BOARDS  </span>
        <span class="content__title align-self-center">
          ({{ projectsStore.projects.length }})</span
        >
      </div>

      <div class="content__items flex flex-column mt-2 flex-shrink-0">
        <div
          v-for="project in projectsStore.projects"
          :key="project.name"
          class="item flex align-items-center cursor-pointer px-2 py-3"
          :class="{
            'item--mini': !fullSideBar,
            'mr-4 px-4 item--rounded': fullSideBar,
            'item--selected':
              project.id === singleProjectStore.selectedProjectId,
          }"
          @click="selectProject(project)"
        >
          <i
            v-if="
              project.id === singleProjectStore.selectedProjectId &&
              singleProjectStore.loading
            "
            class="pi pi-spin pi-spinner"
            style="font-size: 1.5rem"
          ></i>
          <ProjectIcon v-else />
          <span class="ml-3">{{ formatItemName(project.name) }}</span>
        </div>
      </div>

      <div class="content__actions mt-2 flex-shrink-1">
        <div
          class="action flex align-items-center cursor-pointer"
          :class="{
            'mr-4 pl-4 action--rounded': fullSideBar,
          }"
        >
          <template v-if="fullSideBar">
            <ProjectIcon color="#6560BA" />
            <span class="action__title ml-3 py-3">Create New Board</span>
          </template>
          <div
            v-else
            class="action--mini align-self-center flex align-items-center py-2"
          >
            <ProjectIcon color="#6560BA" class="mr-2" />
            <span>+</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.side-bar {
  width: 300px;

  background-color: #2c2c38;
  border-top: 3px solid #2f2f3b;
  border-bottom: 3px solid #2f2f3b;

  &--mini {
    width: 100px;
  }

  &__title {
    font-size: 32px;
    font-weight: 600;
    color: #dfdcff;
  }
}
.content {
  &__title {
    font-size: 14px;
    font-weight: 600;
    color: #7e828e;
  }

  &__items {
    max-height: 400px;
    overflow-y: auto;

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
}

.item {
  font-size: 16px;
  font-weight: 600;
  color: #dfdcff;

  &:hover {
    background-color: #645fc617;
  }

  &:active {
    color: #6560ba;
  }

  &--rounded {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  &--selected {
    background-color: #6560ba;

    &:hover {
      background-color: #6560ba;
    }
  }
}

.action {
  &:hover {
    background-color: #645fc617;
  }

  &--rounded {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  &--mini {
    color: #6560ba;
    padding: 0 20px;
    font-size: 24px;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: #6560ba;
  }
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import router from '@/router'
import ProjectIcon from '@/components/icons/ProjectIcon.vue'

import { useProjectsStore } from '@/stores/projects'
import { useSingleProjectStore } from '@/stores/singleProject'
import { useLayoutStore } from '@/stores/layout'

import { iProjectMenuItem } from '@/models/projectsListTypes'

const projectsStore = useProjectsStore()
const singleProjectStore = useSingleProjectStore()
const layoutStore = useLayoutStore()

const fullSideBar = computed(() => layoutStore.sideBarOpened)

const selectProject = (project: iProjectMenuItem): void => {
  if (singleProjectStore.loading) return
  router.push({ name: 'SingleProject', params: { id: project.id } })
}

const formatItemName = (name: string): string => {
  const trimName = (name: string) => {
    if (name.length > 14) return name.slice(0, 14) + '...'
    return name
  }
  return fullSideBar.value ? trimName(name) : name.slice(0, 3).toUpperCase()
}
</script>

<template>
  <div class="side-bar" :class="{ 'side-bar--mini': !fullSideBar }">
    <div class="side-bar__hamburger flex align-items-center p-4">
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
        class="px-4 flex flex-shrink-1 align-items-center"
        :class="{ 'align-self-center': !fullSideBar }"
      >
        <span v-if="fullSideBar" class="content__title mr-1">ALL BOARDS</span>
        <span class="content__title align-self-center">
          ({{ projectsStore.projects.length }})</span
        >
      </div>

      <div
        class="content__items flex flex-column mt-2 flex-shrink-0"
        :class="{ 'content__items-mini': !fullSideBar }"
      >
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
          <ProjectIcon
            :class="{
              shaking:
                project.id === singleProjectStore.selectedProjectId &&
                singleProjectStore.loading,
            }"
          />
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

  &__items-mini {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
      display: none;
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

.shaking {
  animation: shake 0.5s ease-in-out infinite;
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
  100% {
    transform: translateX(0);
  }
}
</style>

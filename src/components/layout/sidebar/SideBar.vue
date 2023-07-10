<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { trimText } from '@/utils/functions'
import { useRoute } from 'vue-router'
import router from '@/router'
import stores from '@/stores'

import { iProjectSimplified } from '@/types/projectsListTypes'

import ArrowDownIcon from '@/components/icons/ArrowDownIcon.vue'
import ArrowRightIcon from '@/components/icons/ArrowRightIcon.vue'
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon.vue'
import { iconComponent } from '@/composables/useDynamicIcon'

const projectsStore = stores.useProjectsStore()
const projectStore = stores.useProjectStore()
const layoutStore = stores.useLayoutStore()
const authStore = stores.useAuthStore()

const route = useRoute()

onMounted(() => {
  projectsStore.getItems().then(() => setActiveMenuItem())
})

interface MenuItem {
  name: string
  icon: string
  pathName?: string
  action?: () => void
  children?: MenuItem[]
  multiple?: boolean
  items?: iProjectSimplified[]
  nestedMenu?: MenuItem[]
  loading?: boolean
}

const menuItems = computed(
  () =>
    [
      {
        name: 'Explore',
        icon: 'ExploreIcon',
        pathName: 'Explore',
      },
      {
        name: 'Boards',
        icon: 'BoardsIcon',
        children: [
          {
            multiple: true,
            items: projectsStore.items as iProjectSimplified[],
            loading: projectStore.loading,
            pathName: 'Project',
            icon: 'BoardIcon',
            nestedMenu: [
              {
                name: 'Members',
                icon: 'MembersIcon',
                pathName: 'ProjectMembers',
              },
              {
                name: 'Statistics',
                icon: 'StatisticsIcon',
                pathName: 'ProjectStatistics',
              },
              {
                name: 'Settings',
                icon: 'SettingsIcon',
                pathName: 'ProjectSettings',
              },
            ],
          },
          {
            name: 'New Board',
            icon: 'NewBoardIcon',
            action: () => {},
          },
        ],
      },
      {
        name: 'User',
        icon: 'UserIcon',
        children: [
          {
            name: 'Account',
            icon: 'AccountIcon',
            pathName: 'Account',
          },
          {
            name: 'Preferences',
            icon: 'PreferencesIcon',
            pathName: 'Preferences',
          },
          {
            name: 'Logout',
            icon: 'LogoutIcon',
            action: authStore.logout,
          },
        ],
      },
    ] as MenuItem[],
)

interface iNestedMenu {
  prevRoute: string
  name: string
  items: MenuItem[]
}

const nestedMenu = ref<iNestedMenu | null>(null)

const menuItemsStates = ref({
  Explore: false,
  Boards: false,
  User: false,
}).value as { [key: string]: boolean }

const fullSideBar = computed(() => layoutStore.sideBarOpened)

const formatItemName = (text: string = ''): string => {
  return trimText(text, 11, fullSideBar.value)
}

const menuItemClasses = (menuItem: MenuItem, data: any = null) => {
  return {
    'menu-item--mini': !fullSideBar.value,
    'menu-item--rounded pl-5 mr-5 pr-3': fullSideBar.value,
    'menu-item--action': !!menuItem.action,
    'menu-item--selected': isSelectedMenuItem(menuItem, data),
    'menu-item--loading':
      isSelectedMenuItem(menuItem, data) && menuItem.loading,
    'menu-item--no-active': !!menuItem.children,
  }
}

const isSelectedMenuItem = (menuItem: MenuItem, data: any) => {
  return data
    ? menuItem.pathName === route.name && data
      ? Number(route.params?.id) === data?.id
      : false
    : menuItem.pathName === route.name
}

const executeMenuItemAction = (
  menuItem: MenuItem,
  childItem: iProjectSimplified | null = null,
) => {
  if (menuItem.pathName) {
    const payload = {
      name: menuItem.pathName,
      params: {},
    }
    if (childItem) payload.params = { id: childItem.id }
    router.push(payload)
  } else {
    menuItem.action && menuItem.action()
  }
}

const toggleMenuItem = (menuItem: MenuItem) => {
  menuItemsStates[menuItem.name] = !menuItemsStates[menuItem.name]
}

const setActiveMenuItem = () => {
  const menuItem = menuItems.value.find(
    (item) =>
      item.pathName === route.name ||
      (item.children &&
        item.children.find((child) => child.pathName === route.name)),
  )
  if (menuItem) toggleMenuItem(menuItem)
}

const setNestedMenu = (childItem: MenuItem, data: any) => {
  nestedMenu.value = {
    prevRoute: route.fullPath,
    name: data.name,
    items: childItem.nestedMenu as MenuItem[],
  }
}

const clearNestedMenu = () => {
  if (nestedMenu.value?.prevRoute) router.push(nestedMenu.value?.prevRoute)
  nestedMenu.value = null
}
</script>

<template>
  <div
    class="side-bar flex flex-column"
    :class="{ 'side-bar--mini ': !fullSideBar }"
  >
    <div
      class="side-bar__logo flex align-items-center justify-content-center p-4"
      :style="{ marginBottom: fullSideBar ? '0' : '2px' }"
    >
      <img
        src="../../../assets/icons/hamburger.svg"
        :class="{ 'rotate-90': !fullSideBar }"
        @click="layoutStore.changeSideBarStatus"
      />
      <span
        v-if="fullSideBar"
        class="side-bar__title ml-3 mr-5"
        @click="router.go"
        >Kanban</span
      >
    </div>

    <div v-if="nestedMenu" class="flex flex-column">
      <div
        class="menu-item menu-item--rounded nested-menu-item pl-5 mr-5 pr-3"
        :class="{ 'menu-item--mini': !fullSideBar }"
      >
        <ArrowLeftIcon
          :class="{ 'mr-3': fullSideBar }"
          @click="clearNestedMenu"
        />
        <span v-if="fullSideBar">{{ nestedMenu.name }}</span>
      </div>
      <div
        v-for="menuItem in nestedMenu.items"
        class="menu-item"
        :class="menuItemClasses(menuItem)"
        @click="executeMenuItemAction(menuItem)"
      >
        <div class="flex align-items-center">
          <component :is="iconComponent(menuItem.icon)" class="icon" />
          <span v-if="fullSideBar" class="menu-item__name">{{
            formatItemName(menuItem.name)
          }}</span>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-column">
      <div v-for="item in menuItems" :key="item.name" id="menuItem">
        <div
          class="menu-item"
          :class="{
            ...menuItemClasses(item),
            'justify-content-between': fullSideBar,
          }"
          @click="
            ;(!item.children && executeMenuItemAction(item)) ||
              toggleMenuItem(item)
          "
        >
          <div class="flex align-items-center">
            <component :is="iconComponent(item.icon)" class="icon" />
            <span v-if="fullSideBar" class="menu-item__name">{{
              formatItemName(item.name)
            }}</span>
          </div>
          <ArrowDownIcon
            v-if="item.children"
            class="ml-3"
            :class="{ 'rotate-180': !menuItemsStates[item.name] }"
          />
        </div>
        <div
          v-if="menuItemsStates[item.name]"
          v-for="child in item.children"
          :key="child.name"
        >
          <div
            v-if="child.multiple && child.items && child.items.length"
            class="menu-item pl-6 pr-4 py-3 mr-4"
            :class="menuItemClasses(child, childItem)"
            id="childRouteItem"
            v-for="(childItem, index) in child.items"
            :key="index"
            @click="executeMenuItemAction(child, childItem)"
          >
            <div class="flex align-items-center justify-space-between">
              <div class="flex align-items-center">
                <component :is="iconComponent(child.icon)" class="icon" />
                <span
                  class="menu-item__name"
                  :class="{ 'menu-item__name--mini': !fullSideBar }"
                  >{{ formatItemName(childItem.name) }}</span
                >
              </div>
              <ArrowRightIcon
                v-if="fullSideBar"
                class="menu-item__arrow-right ml-4"
                @click="child.nestedMenu && setNestedMenu(child, childItem)"
              />
            </div>
          </div>
          <div
            v-else
            class="menu-item pl-6 pr-2 py-3 mr-4"
            :id="child.action ? 'childActionItem' : 'childRouteItem'"
            :class="menuItemClasses(child)"
            @click="executeMenuItemAction(child)"
          >
            <div class="flex align-items-center">
              <component :is="iconComponent(child.icon)" class="icon" />
              <span v-if="fullSideBar" class="menu-item__name">{{
                formatItemName(child.name)
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.side-bar {
  width: 280px;
  min-width: 280px;
  background-color: #2c2c38;
  border-top: 3px solid #2f2f3b;
  border-bottom: 3px solid #2f2f3b;

  &__logo {
    cursor: pointer;

    img {
      transition: transform 0.2s ease;
    }
  }

  &__title {
    font-size: 32px;
    font-weight: 600;
    color: #dfdcff;
  }

  &--mini {
    width: 100px;
    min-width: 100px;
  }
}

.nested-menu-item {
  background-color: #474479;
  &:hover {
    background-color: #474479 !important;
  }

  &:active {
    color: #dfdcff !important;
  }
}
.menu-item {
  font-size: 16px;
  font-weight: 600;
  color: #dfdcff;
  height: 48px;
  transition: transform 0.2s ease;
  cursor: pointer;
  display: flex;
  align-items: center;

  &__name {
    width: 105px;
    margin-left: 16px;
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */

    &--mini {
      width: auto;
    }
  }

  &:hover {
    background-color: #645fc617;
  }

  &:active {
    color: #6560ba;
  }

  &--mini {
    padding: 0px !important;
    margin: 0 !important;
    border-radius: 0 !important;
    justify-content: center;
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

    &:active {
      color: #dfdcff;
    }
  }

  &--no-active {
    &:active {
      color: #dfdcff;
    }
  }

  &--action {
    color: #6560ba;
  }

  &--loading {
    .icon {
      animation: shake 0.5s ease-in-out infinite;
    }
  }

  .icon {
    width: 21px;
  }
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

@keyframes moveRight {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(10px);
  }
}
</style>

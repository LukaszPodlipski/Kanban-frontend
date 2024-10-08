<script setup lang="ts">
import ArrowDownIcon from '@/components/icons/ArrowDownIcon.vue'
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon.vue'
import ArrowRightIcon from '@/components/icons/ArrowRightIcon.vue'
import { iconComponent, iconNameType } from '@/composables/useDynamicIcon'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import { useLayoutStore } from '@/stores/layout'
import { useProjectStore } from '@/stores/project'
import { useProjectsStore } from '@/stores/projects'
import { iListItem } from '@/types/baseTypes'
import { trimText } from '@/utils/functions'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const projectsStore = useProjectsStore()
const projectStore = useProjectStore()
const layoutStore = useLayoutStore()
const authStore = useAuthStore()

const route = useRoute()
const i18n = useI18n()

onMounted(() => {
  projectsStore.getItems().then(() => setActiveMenuItem())
})

watch(
  () => route.name,
  () => setActiveMenuItem(),
)

interface MenuItem {
  name: string
  label: string
  icon: iconNameType
  pathName?: string
  action?: () => void
  children?: MenuItem[]
  multiple?: boolean
  items?: iListItem[]
  nestedMenu?: MenuItem[]
  loading?: boolean
}

const userProjects = computed(() =>
  projectsStore.items.sort((a, b) => a.id - b.id),
)

const menuItems = computed(
  () =>
    [
      {
        name: 'Explore',
        label: i18n.t('sidebar.explore'),
        icon: 'ExploreIcon',
        pathName: 'Explore',
      },
      {
        name: 'Boards',
        label: i18n.t('sidebar.boards'),
        icon: 'BoardsIcon',
        children: [
          {
            multiple: true,
            items: userProjects.value as iListItem[],
            loading: projectStore.loading,
            pathName: 'Board',
            icon: 'BoardIcon',
            nestedMenu: [
              {
                name: 'Backlog',
                label: i18n.t('sidebar.backlog'),
                icon: 'BacklogIcon',
                pathName: 'ProjectBacklog',
              },
              {
                name: 'Members',
                label: i18n.t('sidebar.members'),
                icon: 'MembersIcon',
                pathName: 'ProjectMembers',
              },
              // {
              //   name: 'Statistics',
              //   label: i18n.t('sidebar.statistics'),
              //   icon: 'StatisticsIcon',
              //   pathName: 'ProjectStatistics',
              // }, TODO: Add statistics page
              {
                name: 'Settings',
                label: i18n.t('sidebar.settings'),
                icon: 'SettingsIcon',
                pathName: 'ProjectSettings',
              },
            ],
          },
          {
            name: 'New Board',
            label: i18n.t('sidebar.newBoard'),
            icon: 'NewBoardIcon',
            action: openNewProjectDialog,
          },
        ],
      },
      {
        name: 'User',
        label: i18n.t('sidebar.user'),
        icon: 'UserIcon',
        children: [
          {
            name: 'Account',
            label: i18n.t('sidebar.account'),
            icon: 'AccountIcon',
            pathName: 'Account',
          },
          {
            name: 'Preferences',
            label: i18n.t('sidebar.preferences'),
            icon: 'PreferencesIcon',
            pathName: 'Preferences',
          },
          {
            name: 'Logout',
            label: i18n.t('sidebar.logout'),
            icon: 'LogoutIcon',
            action: authStore.logout,
          },
        ],
      },
    ] as MenuItem[],
)

interface iPrevRoute {
  name: string
  params: {
    id: number
  }
}

interface iNestedMenu {
  prevRoute: iPrevRoute
  name: string
  label: string
  items: MenuItem[]
}

const nestedMenu = ref<iNestedMenu | null>(null)

const menuItemsStates = ref({
  Explore: false,
  Boards: false,
  User: false,
}).value as { [key: string]: boolean }

const isSidebarLarge = computed(() => layoutStore.sidebarSize === 'large')
const isSidebarHidden = computed(() => layoutStore.sidebarSize === 'hidden')

const formatItemName = (text: string = ''): string => {
  return trimText(text, 12, isSidebarLarge.value)
}

const menuItemClasses = (menuItem: MenuItem, data: any = null) => {
  return {
    'menu-item--mini': !isSidebarLarge.value,
    'menu-item--rounded pl-5 mr-5 pr-3': isSidebarLarge.value,
    'menu-item--action': !!menuItem.action,
    'menu-item--selected': isSelectedMenuItem(menuItem, data),
    'menu-item--loading':
      isSelectedMenuItem(menuItem, data) && menuItem.loading,
    'menu-item--no-active': !!menuItem.children,
  }
}

const isSelectedMenuItem = (menuItem: MenuItem, data: any) => {
  return data
    ? menuItem.pathName === route.name
      ? Number(route.params?.id) === data?.id
      : false
    : menuItem.pathName === route.name
}

const executeMenuItemAction = (
  menuItem: MenuItem,
  childItem: iListItem | null = null,
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

const toggleMenuItem = (
  menuItem: MenuItem,
  overwritedState: boolean = false,
) => {
  menuItemsStates[menuItem.name] =
    overwritedState || !menuItemsStates[menuItem.name]
}

const setActiveMenuItem = () => {
  const routeName = route.name
  const menuItemIndex = menuItems.value.findIndex(
    (item) =>
      item.pathName === routeName ||
      (item.children &&
        item.children.find((child) => child.pathName === routeName)) ||
      (item.children &&
        item.children.find((child) =>
          child.nestedMenu?.find((nested) => nested.pathName === routeName),
        )),
  )

  const childrenIndex = menuItems.value[menuItemIndex]?.children?.findIndex(
    (child) =>
      child.pathName === routeName ||
      child.nestedMenu?.find((nested) => nested.pathName === routeName),
  ) as number

  const nestedMenuElementIndex = menuItems.value[menuItemIndex]?.children
    ?.at(childrenIndex)
    ?.nestedMenu?.findIndex((nested) => nested.pathName === routeName) as number

  if (menuItemIndex >= 0) toggleMenuItem(menuItems.value[menuItemIndex], true)

  if (nestedMenuElementIndex >= 0) {
    const menuChild = menuItems.value[menuItemIndex].children?.at(
      childrenIndex,
    ) as MenuItem

    setNestedMenu(menuChild, {
      name:
        menuChild?.items &&
        menuChild?.items.find((item) => item?.id === Number(route?.params?.id))
          ?.name,
    })
  } else {
    nestedMenu.value = null
  }
}

const setNestedMenu = (childItem: MenuItem, data: any) => {
  nestedMenu.value = {
    prevRoute: {
      name: childItem.pathName || '',
      params: {
        id: Number(route.params.id),
      },
    },
    name: data.name,
    label: childItem.label,
    items: childItem.nestedMenu as MenuItem[],
  }
}

const clearNestedMenu = () => {
  const prevRoute = nestedMenu.value?.prevRoute
  if (prevRoute && Object.keys(prevRoute).length)
    router.push({ name: prevRoute.name, params: prevRoute.params })
  nestedMenu.value = null
}

const openNewProjectDialog = () => {
  layoutStore.openDialog({
    title: i18n.t('project.createNewProject'),
    component: 'CreateNewProjectDialog',
    size: '900px',
  })
}
</script>

<template>
  <div
    v-if="!isSidebarHidden"
    class="side-bar flex flex-column"
    :class="{ 'side-bar--mini ': !isSidebarLarge }"
  >
    <div class="side-bar__logo flex align-items-center justify-content-center">
      <img
        src="../../../assets/images/hamburger.svg"
        :class="{ 'rotate-90': !isSidebarLarge }"
        class="mb-1"
        @click="layoutStore.changeSideBarStatus"
      />
      <span
        v-if="isSidebarLarge"
        class="side-bar__title ml-5 mr-5"
        @click="() => router.go(0)"
        >Kanban</span
      >
    </div>

    <div v-if="nestedMenu" class="flex flex-column">
      <div
        class="menu-item menu-item--rounded nested-menu-item pl-5 mr-5 pr-3"
        :class="{ 'menu-item--mini': !isSidebarLarge }"
      >
        <ArrowLeftIcon
          :class="{ 'mr-3': isSidebarLarge }"
          @click="clearNestedMenu"
        />
        <span v-if="isSidebarLarge">{{ nestedMenu.name }}</span>
      </div>
      <div
        v-for="menuItem in nestedMenu.items"
        class="menu-item"
        :class="menuItemClasses(menuItem)"
        @click="executeMenuItemAction(menuItem)"
      >
        <div class="flex align-items-center">
          <component :is="iconComponent(menuItem.icon)" class="icon" />
          <span v-if="isSidebarLarge" class="menu-item__name">{{
            formatItemName(menuItem.label)
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
            'justify-content-between': isSidebarLarge,
          }"
          @click="
            ;(!item.children && executeMenuItemAction(item)) ||
              toggleMenuItem(item)
          "
        >
          <div class="flex align-items-center">
            <component :is="iconComponent(item.icon)" class="icon" />
            <span v-if="isSidebarLarge" class="menu-item__name">{{
              formatItemName(item.label)
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
            class="menu-item pl-6 pr-3 py-3 mr-4"
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
                  :class="{ 'menu-item__name--mini': !isSidebarLarge }"
                  >{{ formatItemName(childItem.name) }}</span
                >
              </div>
              <ArrowRightIcon
                v-if="isSidebarLarge && isSelectedMenuItem(child, childItem)"
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
              <span v-if="isSidebarLarge" class="menu-item__name">{{
                formatItemName(child.label)
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
  background-color: $grayscale-darken3;
  border-top: 3px solid $grayscale-darken5;
  border-bottom: 3px solid $grayscale-darken5;

  &__logo {
    height: 80px;
    padding: 20px;
    cursor: pointer;

    img {
      transition: transform 0.2s ease;
      animation: rotate 0.4s ease;
    }
  }

  &__title {
    font-size: 32px;
    font-weight: 600;
    color: $primary-lighten;
  }

  &--mini {
    width: 100px;
    min-width: 100px;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(-180deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.nested-menu-item {
  background-color: $primary-darken2;
  &:hover {
    background-color: $primary-darken2 !important;
  }

  &:active {
    color: $primary-lighten !important;
  }
}
.menu-item {
  font-size: 16px;
  font-weight: 500;
  color: $primary-lighten;
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
    color: $primary-base;
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
    background-color: $primary-base;

    &:hover {
      background-color: $primary-base;
    }

    &:active {
      color: $primary-lighten;
    }
  }

  &--no-active {
    &:active {
      color: $primary-lighten;
    }
  }

  &--action {
    color: $primary-base;
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

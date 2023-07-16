<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMembersStore } from '@/stores/members';
import Menu from 'primevue/menu'
import { ISimplifiedUser } from '@/types/userTypes'

const membersStore = useMembersStore()

const numOfVisibleMembers = 3

const members = computed<ISimplifiedUser[]>(() => membersStore?.items || [])
const numOfMembers = computed<number>(() => members.value.length)

const selectedMembers = ref<number[]>([])

const menu = ref(null)

const toggleMenu = (event: any) => {
  ;(menu.value as any).toggle(event)
}

const toggleSelectedMember = (memberId: number) => {
  if (selectedMembers.value.includes(memberId)) {
    selectedMembers.value = selectedMembers.value.filter(
      (member) => member !== memberId,
    )
  } else {
    selectedMembers.value = [...selectedMembers.value, memberId]
  }
}

const menuModel = computed(() => [
  {
    label: 'Members',
    items: [],
  },
])

const exceedingMembers = computed(() => {
  return members.value.slice(numOfVisibleMembers)
})

const anyExceedingMembersSelected = computed(() => {
  return exceedingMembers.value.some((member) =>
    selectedMembers.value.includes(member.id),
  )
})
</script>

<template>
  <div class="flex align-items-center" v-if="!membersStore.loading">
    <div
      v-for="member in members.slice(0, numOfVisibleMembers)"
      :key="member.id"
      class="member__img"
      :class="{ 'member__img--active': selectedMembers.includes(member.id) }"
      v-tooltip.bottom="member.fullName"
      @click="toggleSelectedMember(member.id)"
    >
      <img :src="member.avatarUrl" alt="" />
    </div>
    <div
      v-if="numOfMembers - numOfVisibleMembers > 0"
      class="exceeding-members flex align-items-center justify-content-center"
      :class="{ 'exceeding-members--active': anyExceedingMembersSelected }"
      @click="toggleMenu"
      aria-haspopup="true"
      aria-controls="overlay_menu"
    >
      <span>+{{ numOfMembers - numOfVisibleMembers }}</span>
    </div>
    <Menu ref="menu" id="overlay_menu" :popup="true" :model="menuModel">
      <template #item>
        <div
          v-for="member in exceedingMembers"
          :key="member.id"
          class="member py-2 flex align-items-center cursor-pointer"
          :class="{
            'member--active': selectedMembers.includes(member.id),
          }"
          @click="toggleSelectedMember(member.id)"
        >
          <div
            class="member__img member__img--small mr-3"
            :class="{
              'member__img--active': selectedMembers.includes(member.id),
            }"
          >
            <img :src="member.avatarUrl" alt="" />
          </div>
          <span v-tooltip.bottom="member.fullName" class="member__fullName">{{
            member.fullName
          }}</span>
        </div>
      </template>
    </Menu>
  </div>
</template>

<style scoped lang="scss">
.member {
  &--active {
    color: #6560ba;
  }
  &__img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: -2px;
    z-index: 0;

    &--small {
      width: 28px;
      height: 28px;
    }

    &--active {
      border: 3px solid #6560ba;
      transform: scale(1.2);
    }

    &:hover {
      z-index: 5;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__fullName {
    width: 120px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
  }
}

.exceeding-members {
  z-index: 1;
  margin-left: -2px;
  background-color: #21212d;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  font-size: 14px;
  color: #6560ba;

  &--active {
    border: 2px solid #6560ba;
    transform: scale(1.2);
  }
}
</style>

<script setup lang="ts">
import DialogTemplate from '@/components/dialog/fragments/DialogTemplate.vue'
import usePermittedUser from '@/composables/usePermittedUser.ts'

import {
  computed,
  onBeforeMount,
  onMounted,
  onUnmounted,
  reactive,
  watch,
} from 'vue'

import { useLayoutStore } from '@/stores/layout'
import { useMembersStore } from '@/stores/members'
import { useProjectStore } from '@/stores/project'

import { iUser } from '@/types/userTypes'
import { roles } from '@/const'

import { formatDate } from '@/utils/functions'
import { useWebsocketStore } from '@/stores/websocket'
import { useAuthStore } from '@/stores/auth'

const layoutStore = useLayoutStore()
const membersStore = useMembersStore()
const projectStore = useProjectStore()
const websocketStore = useWebsocketStore()
const authStore = useAuthStore()


/* -------------------------------- ON DIALOG OPEN --------------------------------- */
/* ------------------------- fetch member and connect to WS -------------------------- */
const dialogItem = computed<iUser>(() => layoutStore.dialog.item)

onBeforeMount(() => {
  websocketStore.joinChannel('MemberIndexChannel', {
    projectId: projectStore.project?.id,
    memberId: dialogItem.value.id,
  })
})

onMounted(async () => {
  await membersStore.getItem(dialogItem.value.id)
})

watch(
  () => dialogItem?.value?.id,
  async () => {
    if (member?.value?.id) {
      websocketStore.leaveChannel('MemberIndexChannel')
      websocketStore.joinChannel('MemberIndexChannel', {
        projectId: projectStore.project?.id,
        memberId: dialogItem.value.id,
      })
    }
  },
)

onUnmounted(() => {
  websocketStore.leaveChannel('MemberIndexChannel')
})

/* ------------------------------ ACCESS NEEDED DATA ------------------------------- */

const member = computed<iUser>(() => {
  return membersStore.item
})

const { isAdmin, userRole } = usePermittedUser()

/* ------------------------------ INITIALIZE LOCAL STATE ------------------------------- */
const fieldsEditingState: {
  [key: string]: boolean
} = reactive({
  role: false,
})

const fieldsValueState: {
  [key: string]: string | null
} = reactive({
  role: null,
})

/* ------------------------------ LOCAL STATE SETTERS ------------------------------- */
/* - State management for the base inputs has been extracted from their components -- */
/* ----- this was done to enable potential manipulation from a parent component ----- */

const updateFieldValue = (value: string, key: string) => {
  fieldsValueState[key] = value
}

/* ------------------------------ FUNCTIONS ------------------------------- */
const submitFieldValue = async (key: string) => {
  try {
    const params = {
      [key]: fieldsValueState[key],
    }
    await membersStore.updateItem(member.value.id, params)
    fieldsEditingState[key] = false

    if (member.value.id === authStore.user.id) {
      projectStore.getCompleteProject(projectStore.project?.id as number)
    }
  } catch (error) {
    console.log(error)
  }
}

const removeMember = async () => {
  try {
    await membersStore.deleteItem(member.value.id)
    layoutStore.closeDialog()
    projectStore.getCompleteProject(projectStore.project?.id as number)
    layoutStore.showToast({
      message: 'Members removed',
      type: 'success',
    })
  } catch (error) {
    console.log(error)
  }
}

/* -------------------------------- UTILS --------------------------------- */
const isMemberOwner = computed(() => {
  return userRole.value === 'Owner' && member.value.id === authStore.user.id
})

const isPermittedToRemoveMember = computed(() => {
  if (isMemberOwner.value) {
    return false
  }
  if (member.value.role === 'Maintainer' && userRole.value === 'Maintainer') {
    return false
  }
  return isAdmin.value
})

const isPermittedToEditRole = computed(() => {
  if (isMemberOwner.value) {
    return false
  }
  return isAdmin.value
})

const removeMemberPermissionTooltipCaption = computed(() => {
  if (isMemberOwner.value) {
    return "You cannot remove yourself because you're an owner"
  }
  if (member.value.role === 'Maintainer' && userRole.value === 'Maintainer') {
    return 'You cannot remove this member because you are a maintainer too'
  }
  if (!isAdmin.value) {
    return 'You cannot remove this member because you are not an project owner or maintainer'
  }
  return ''
})


const editRoleTooltipCaption = computed(() => {
  if (isMemberOwner.value) {
    return 'You cannot edit your role because you are an owner'
  }
  if (!isAdmin.value) {
    return 'You cannot edit this member role because you are not an project owner or maintainer'
  }
  return ''
})
</script>

<template>
  <DialogTemplate hideActions>
    <template #customHeader>
      <span>Member</span>
    </template>
    <template #content>
      <div class="flex">
        <div class="member__left-panel">
          <img :src="member.avatarUrl" class="member__avatar" />
          <span class="member__name">{{ member.fullName }}</span>
          <div v-tooltip.bottom="removeMemberPermissionTooltipCaption">
            <BaseButton
              class="mt-4 ml-2"
              label="Remove from project"
              :disabled="!isPermittedToRemoveMember"
              @click="removeMember"
            />
          </div>
        </div>

        <div class="member__right-panel flex-grow-1">
          <BaseDoubleClickSelect
            v-tooltip.left="editRoleTooltipCaption"
            fieldKey="role"
            label="Role"
            class="mb-2"
            :value="member.role"
            :isEditing="fieldsEditingState.role"
            :items="roles"
            optionsLabel=""
            optionsValue=""
            :readonly="!isAdmin || !isPermittedToEditRole"
            placeholder="Assign role to the member"
            @setEditingState="fieldsEditingState.role = $event.value"
            @updateFieldValue="({ value, key }: any) => updateFieldValue(value, key)"
            @submitFieldValue="(key: string) => submitFieldValue(key)"
          />

          <BaseDoubleClickSelect
            class="mb-2"
            label="Email"
            :value="member.email"
            readonly
          />

          <BaseDoubleClickSelect
            label="Member since"
            :value="formatDate(member.createdAt)"
            readonly
          />
        </div>
      </div>
    </template>
  </DialogTemplate>
</template>

<style scoped lang="scss">
.member {
  &__left-panel {
    background-color: #2c2c38;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px;
  }

  &__right-panel {
    padding: 16px 16px 32px 16px;
    background-color: #292938;
  }

  &__name {
    margin-top: 24px;
    font-size: 18px;
    font-weight: 500;
  }

  &__avatar {
    width: 180px;
    height: 180px;
    border-radius: 50%;
  }

  &__data-label {
    font-size: 18px;
    font-weight: 500;
  }

  &__data-value {
    margin-top: 4px;
  }
}
</style>

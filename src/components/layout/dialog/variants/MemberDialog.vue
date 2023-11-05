<script setup lang="ts">
import DialogTemplate from '@/components/layout/dialog/DialogTemplate.vue'
import usePermittedUser from '@/composables/usePermittedUser.ts'
import { roles } from '@/const'
import { useAuthStore } from '@/stores/auth'
import { useLayoutStore } from '@/stores/layout'
import { useMembersStore } from '@/stores/members'
import { useProjectStore } from '@/stores/project'
import { useWebsocketStore } from '@/stores/websocket'
import { iUser } from '@/types/userTypes'
import { formatDate } from '@/utils/functions'
import {
  computed,
  onBeforeMount,
  onMounted,
  onUnmounted,
  reactive,
  watch,
} from 'vue'
import { useI18n } from 'vue-i18n'

const layoutStore = useLayoutStore()
const membersStore = useMembersStore()
const projectStore = useProjectStore()
const websocketStore = useWebsocketStore()
const authStore = useAuthStore()

const { t } = useI18n()

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
      message: t('members.memberRemoved'),
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
    return t('members.removeSelfMemberPermissionError')
  }
  if (member.value.role === 'Maintainer' && userRole.value === 'Maintainer') {
    return t('members.removeMaintainerAsMaintainerError')
  }
  if (!isAdmin.value) {
    return t('members.removeMemberError')
  }
  return ''
})

const editRoleTooltipCaption = computed(() => {
  if (isMemberOwner.value) {
    return t('members.editSelfOwnerRoleError')
  }
  if (!isAdmin.value) {
    return t('members.editMemberRoleError')
  }
  return ''
})
</script>

<template>
  <DialogTemplate hideActions>
    <template #customHeader>
      <span>{{ $t('members.member') }}</span>
    </template>
    <template #content>
      <div class="flex">
        <div class="member__left-panel">
          <img :src="member.avatarUrl" class="member__avatar" />
          <span class="member__name">{{ member.fullName }}</span>
          <div v-tooltip.bottom="removeMemberPermissionTooltipCaption">
            <BaseButton
              class="mt-4 ml-2"
              :label="$t('members.removeFromProject')"
              :disabled="!isPermittedToRemoveMember"
              @click="removeMember"
            />
          </div>
        </div>

        <div class="member__right-panel flex-grow-1">
          <BaseDoubleClickSelect
            v-tooltip.left="editRoleTooltipCaption"
            fieldKey="role"
            :label="$t('members.role')"
            class="mb-2"
            :value="member.role"
            :isEditing="fieldsEditingState.role"
            :items="roles"
            optionsLabel=""
            optionsValue=""
            required
            :readonly="!isAdmin || !isPermittedToEditRole"
            :placeholder="$t('members.assignRoleToMember')"
            @setEditingState="fieldsEditingState.role = $event.value"
            @updateFieldValue="({ value, key }: any) => updateFieldValue(value, key)"
            @submitFieldValue="(key: string) => submitFieldValue(key)"
          />

          <BaseDoubleClickSelect
            class="mb-2"
            :label="$t('members.email')"
            :value="member.email"
            readonly
          />

          <BaseDoubleClickSelect
            :label="$t('members.createdAt')"
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
    background-color: $grayscale-darken3;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px;
  }

  &__right-panel {
    padding: 16px 16px 32px 16px;
    background-color: $grayscale-darken6;
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

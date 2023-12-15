<script setup lang="ts">
import DialogTemplate from '@/components/layout/dialog/DialogTemplate.vue'
import { useLayoutStore } from '@/stores/layout'
import { useMembersStore } from '@/stores/members'
import { useProjectStore } from '@/stores/project'
import { iMemberItem } from '@/types/userTypes'
import { computed, ref, Ref } from 'vue'
import { useI18n } from 'vue-i18n'

import MemberInvitationPartial from './partials/MemberInvitationPartial.vue'

const projectStore = useProjectStore()
const layoutStore = useLayoutStore()
const membersStore = useMembersStore()

const loading = computed(() => {
  return membersStore.loadingItem
})

const members: Ref<iMemberItem[]> = ref([])

const { t } = useI18n()

const inviteMembers = async () => {
  try {
    const params = {
      projectId: projectStore.project?.id as number,
      users: members.value.map((member) => ({
        id: member.id,
        role: member.role,
      })),
    }
    await membersStore.inviteMembers(params)
    layoutStore.showToast({
      message: t('members.membersInvited'),
      type: 'success',
    })
    layoutStore.closeDialog()
  } catch (err) {
    layoutStore.showToast({
      message: t('members.errorInvitingMembers'),
      type: 'error',
    })
  }
}
</script>

<template>
  <form @submit.prevent="inviteMembers" class="flex flex-column gap-2">
    <DialogTemplate :loading="loading">
      <template #content>
        <MemberInvitationPartial v-model:members="members" />
      </template>
      <template #actions>
        <BaseButton
          type="submit"
          :label="$t('members.inviteMembers')"
          icon="check"
          :disabled="!members.length"
        />
      </template>
    </DialogTemplate>
  </form>
</template>

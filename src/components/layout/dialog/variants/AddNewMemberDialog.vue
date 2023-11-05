<script setup lang="ts">
import DialogTemplate from '@/components/layout/dialog/DialogTemplate.vue'
import { roles } from '@/const'
import { useLayoutStore } from '@/stores/layout'
import { useMembersStore } from '@/stores/members'
import { useProjectStore } from '@/stores/project'
import { iMemberItem } from '@/types/userTypes'
import rules from '@/utils/validators'
import { computed, ref, Ref } from 'vue'
import { useI18n } from 'vue-i18n'

const projectStore = useProjectStore()
const layoutStore = useLayoutStore()
const membersStore = useMembersStore()

const loading = computed(() => {
  return membersStore.loadingItem
})

const memberEmail: Ref<string> = ref('')
const members: Ref<iMemberItem[]> = ref([])
const foundMember: Ref<iMemberItem | null> = ref(null)

const { t } = useI18n()

const addFoundMember = () => {
  members.value.push({ ...foundMember.value, role: 'Editor' } as iMemberItem)
  memberEmail.value = ''
  foundMember.value = null
}

const removeFoundMember = (index: number) => {
  members.value.splice(index, 1)
}

const searchEmail = async () => {
  if (!memberEmail.value || rules.email(memberEmail.value) !== true) {
    foundMember.value = null
    return
  }

  try {
    const params = {
      email: memberEmail.value,
      projectId: projectStore.project?.id as number,
    }
    foundMember.value = await membersStore.checkMemberEmail(params)
    addFoundMember()
  } catch (_err) {
    foundMember.value = null
    layoutStore.showToast({
      message: t('members.userNotFound'),
      type: 'error',
    })
  }
}

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
        <div class="flex flex-column flex-wrap px-4 pt-4 w-full">
          <span class="field-label">{{ $t('members.findMemberByEmail') }}</span>
          <div class="flex w-full">
            <div class="card p-fluid w-full">
              <BaseInput
                v-model="memberEmail"
                label="EmailField"
                class="w-full"
                :disabled="loading"
                :placeholder="$t('members.enterUserEmail')"
                :floatLabel="false"
                :rules="[rules.email]"
              />
            </div>
            <BaseButton
              @click="searchEmail"
              class="ml-2"
              :icon="loading ? 'spinner' : 'search'"
              large
              :spin="loading"
              :disabled="
                !memberEmail ||
                loading ||
                members.some((member) => member.email === memberEmail)
              "
            />
          </div>
          <span v-if="members.length" class="field-label mb-2">{{
            $t('members.membersToBeInvited')
          }}</span>
          <div v-if="members.length" class="members-list">
            <div
              v-for="(member, index) in members"
              :key="member.id"
              class="member"
            >
              <div class="flex align-items-center">
                <img :src="member.avatarUrl" class="member__avatar" />
                <span v-tooltip.bottom="member.email" class="member__email">{{
                  member.email
                }}</span>
              </div>
              <div class="flex">
                <BaseSelect
                  v-model="member.role"
                  :items="roles"
                  :label="$t('members.role')"
                  :placeholder="$t('members.selectRole')"
                />
                <i
                  class="pi pi-times cursor-pointer align-self-center ml-3"
                  @click="removeFoundMember(index)"
                ></i>
              </div>
            </div>
          </div>
        </div>
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

<style scoped lang="scss">
.members-list {
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
  background-color: $grayscale-darken4;
  border-radius: 4px;
}
.member {
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:not(:last-child) {
    margin-bottom: 16px;
  }
  &__avatar {
    height: 30px;
    width: 30px;
    border-radius: 50%;
  }
  &__email {
    max-width: 220px;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-left: 16px;
  }
}
.field-label {
  margin-bottom: 8px;
}

:deep(.p-autocomplete-multiple-container) {
  width: 100%;
}

:deep(.p-dropdown-label) {
  height: 35px !important;
  width: 150px !important;
  padding: 0.45rem 0.75rem !important;
}
</style>

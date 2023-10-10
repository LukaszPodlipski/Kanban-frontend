<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

import { computed, onBeforeMount, onMounted, watch } from 'vue'

import { useRoute } from 'vue-router'
import { useMembersStore } from '@/stores/members'
import { useLayoutStore } from '@/stores/layout'
import { useProjectStore } from '@/stores/project'
import { useWebsocketStore } from '@/stores/websocket'

import { iUser } from '@/types/userTypes'

import useResizableTable from '@/composables/useResizableTable'

import { formatDate } from '@/utils/functions'

const membersStore = useMembersStore()
const layoutStore = useLayoutStore()
const websocketStore = useWebsocketStore()
const projectStore = useProjectStore()

const { tableHeight } = useResizableTable()

const route = useRoute()
const id = computed(() => Number(route.params.id))

onBeforeMount(() => {
  websocketStore.joinChannel('MembersIndexChannel', { projectId: id.value })
})

watch(id, async () => {
  if (id.value) {
    websocketStore.leaveChannel('MembersIndexChannel')
    websocketStore.joinChannel('MembersIndexChannel', { projectId: id.value })
    projectStore.getCompleteProject(id.value)
  }
})

onMounted(async () => {
  await projectStore.getCompleteProject(id.value)
})

const members = computed(() => {
  return membersStore.items
})

const openMemberDialog = (payload: any) => {
  const member: iUser = payload.data
  layoutStore.openDialog({
    title: member.name,
    component: 'MemberDialog',
    item: member,
    hideHeader: true,
    size: '600px',
  })
}
</script>

<template>
  <div class="members-wrapper">
    <DataTable
      :value="members"
      tableStyle="min-width: 50rem"
      size="small"
      @rowSelect="openMemberDialog"
      selectionMode="single"
      dataKey="id"
      removableSort
      scrollable
      :scrollHeight="tableHeight"
      :metaKeySelection="false"
      :loading="membersStore.loading"
    >
      <Column field="" header=""></Column>
      <Column field="fullName" header="Name" sortable>
        <template #body="{ data }">
          <div class="flex align-items-center">
            <img class="member__avatar mr-3" :src="data.avatarUrl" />
            <span>{{ data.fullName }}</span>
          </div>
        </template>
      </Column>
      <Column field="email" header="Email" sortable></Column>
      <Column field="role" header="Role" sortable></Column>
      <Column field="createdAt" header="Member since" sortable>
        <template #body="{ data }">
          <span>{{ formatDate(data.createdAt) }}</span>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped lang="scss">
.members-wrapper {
  border-left: 3px solid #2f2f3b;
  height: 100%;
}

.member {
  &__avatar {
    height: 20px;
    width: 20px;
    border-radius: 50%;
  }
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  background-color: #21212d;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  border: 1px solid #6560ba5c;
  border-width: 0 0 1px 0 !important;
}
</style>

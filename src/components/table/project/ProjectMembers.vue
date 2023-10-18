<script setup lang="ts">
import useResizableTable from '@/composables/useResizableTable'
import { useLayoutStore } from '@/stores/layout'
import { useMembersStore } from '@/stores/members'
import { useProjectStore } from '@/stores/project'
import { useWebsocketStore } from '@/stores/websocket'
import { iUser } from '@/types/userTypes'
import { formatDate } from '@/utils/functions'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import { computed, onBeforeMount, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

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
      <Column field="fullName" :header="$t('members.name')" sortable>
        <template #body="{ data }">
          <div class="flex align-items-center">
            <img class="member__avatar mr-3" :src="data.avatarUrl" />
            <span>{{ data.fullName }}</span>
          </div>
        </template>
      </Column>
      <Column field="email" :header="$t('members.email')" sortable></Column>
      <Column field="role" :header="$t('members.role')" sortable></Column>
      <Column field="createdAt" :header="$t('members.createdAt')" sortable>
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

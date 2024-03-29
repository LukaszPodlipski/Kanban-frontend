import { useWebSocket } from '@/composables/useWebsockets.js'
import { useColumnsStore } from '@/stores/columns'
import { useMembersStore } from '@/stores/members'
import { useTasksStore } from '@/stores/tasks'
import { iListItem } from '@/types/baseTypes'
import { iColumn } from '@/types/columnTypes'
import { iTask } from '@/types/taskTypes'
import { iUser } from '@/types/userTypes'
import { iProjectDataWSPayload } from '@/types/websocketTypes'
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useProjectStore } from './project'
import { useProjectsStore } from './projects'

type FunctionDictionary = {
  [key: string]: {
    [key: string]: (data: any) => void
  }
}

export const useWebsocketStore = defineStore('websocket', () => {
  const storesList = {
    tasks: useTasksStore(),
    columns: useColumnsStore(),
    members: useMembersStore(),
    project: useProjectStore(),
    projects: useProjectsStore(),
  }

  const functionDictionary: FunctionDictionary = {
    TasksIndexChannel: {
      create: (data: iTask) => {
        storesList.tasks.WSCreatedItemsHandler(data)
      },
      update: (data: iTask) => {
        storesList.tasks.WSUpdatedItemsHandler(data)
      },
      delete: (data: iTask) => {
        storesList.tasks.WSDeletedItemsHandler(data)
      },
    },
    TaskIndexChannel: {
      update: (data: iTask) => {
        storesList.tasks.WSUpdatedItemHandler(data)
      },
    },
    ColumnsIndexChannel: {
      create: (data: iColumn) => {
        storesList.columns.WSCreatedItemsHandler(data)
      },
      update: (data: iColumn) => {
        storesList.columns.WSUpdatedItemsHandler(data)
      },
      delete: (data: iColumn) => {
        storesList.columns.WSDeletedItemsHandler(data)
      },
    },
    MembersIndexChannel: {
      create: (data: iUser) => {
        storesList.members.WSCreatedItemsHandler(data)
      },
      update: (data: iUser) => {
        storesList.members.WSUpdatedItemsHandler(data)
      },
      delete: (data: iUser) => {
        storesList.members.WSDeletedItemsHandler(data)
      },
    },
    MemberIndexChannel: {
      update: (data: iUser) => {
        storesList.members.WSUpdatedItemHandler(data)
      },
    },
    ProjectIndexChannel: {
      update: (data: iProjectDataWSPayload) => {
        storesList.project.WSUpdatedProjectHandler(data)
      },
    },
    UserProjectsIndexChannel: {
      create: (data: iListItem) => {
        storesList.projects.WSCreatedItemsHandler(data)
      },
      update: (data: iListItem) => {
        storesList.projects.WSUpdatedItemsHandler(data)
      },
      delete: (data: iListItem) => {
        storesList.projects.WSDeletedItemsHandler(data)
      }
    },
  }

  const websocket = useWebSocket()
  const socket = ref<any>(null)

  const connectWS = () => {
    socket.value = websocket.connect()
  }

  const disconnectWS = () => {
    websocket.disconnect()
    socket.value = null
  }

  const joinChannel = (channel: string, params: any) => {
    websocket.joinChannel(channel, params)
  }

  const leaveChannel = (channel: string) => {
    websocket.leaveChannel(channel)
  }

  const handleMessage = (messageEvent: any) => {
    try {
      const { identifier, message } = JSON.parse(messageEvent.data)
      const { channel } = identifier || {}
      const { actionType } = message || {}

      if (
        channel &&
        actionType &&
        functionDictionary[channel] &&
        functionDictionary[channel][actionType]
      ) {
        const selectedFunction = functionDictionary[channel][actionType]
        selectedFunction(message.data)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  return {
    socket,
    connectWS,
    disconnectWS,
    joinChannel,
    leaveChannel,
    handleMessage,
    storesList,
  }
})

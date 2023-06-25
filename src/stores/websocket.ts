import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useWebSocket } from '@/composables/useWebsockets.js'
import { useSingleProjectStore } from '@/stores/singleProject.js'
import { iTask } from '@/types/taskTypes'

type FunctionDictionary = {
  [key: string]: {
    [key: string]: (data: iTask) => void
  }
}

export const useWebsocketStore = defineStore('websocket', () => {
  const stores = {
    singleProject: useSingleProjectStore(),
  }

  const functionDictionary: FunctionDictionary = {
    TasksIndexChannel: {
      create: (data: iTask) => {
        stores.singleProject.createTask(data)
      },
      update: (data: iTask) => {
        stores.singleProject.updateTask(data)
      },
      delete: (data: iTask) => {
        stores.singleProject.deleteColumn(data)
      },
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
    stores,
  }
})

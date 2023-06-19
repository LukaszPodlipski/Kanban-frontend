import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useWebSocket } from '@/composables/useWebsockets.js'

export const useWebsocketStore = defineStore('websocket', () => {
  const websocket = useWebSocket()
  const socket = ref<any>(null)

  const connectWS = () => {
    socket.value = websocket.connect()
  }

  const disconnectWS = () => {
    websocket.disconnect()
    socket.value = null
  }

  const joinChannel = (channel: string) => {
    websocket.joinChannel(channel)
  }

  const leaveChannel = (channel: string) => {
    websocket.leaveChannel(channel)
  }

  const handleMessage = (messageEvent: any) => {
    try {
      const message = JSON.parse(messageEvent.data)
      console.log('message', message)
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
  }
})

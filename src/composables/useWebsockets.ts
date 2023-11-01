import { useAuthStore } from '@/stores/auth'
import { useWebsocketStore } from '@/stores/websocket'
import { ref } from 'vue'

export function useWebSocket() {
  const authStore = useAuthStore()
  const websocketStore = useWebsocketStore()
  const socket = ref<WebSocket | null>(null) // Type assertion for socket
  const token = ref('')
  const isConnected = ref(false)
  const url = import.meta.env.VITE_WS_BASE_URL

  const connect = () => {
    token.value = authStore.token
    socket.value = new WebSocket(
      `${url}?Authorization=${token.value}`,
    ) as WebSocket // Type assertion

    socket.value.addEventListener('open', function () {
      isConnected.value = true
    })

    socket.value.addEventListener('close', function () {
      isConnected.value = false
    })

    socket.value.addEventListener('message', function (event: MessageEvent) {
      // Type annotation for event
      websocketStore.handleMessage(event)
    })

    return socket.value
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.close()
    }
  }

  const send = (message: any) => {
    // Specify the actual type of 'message'
    waitForConnection(() => {
      if (socket.value && socket.value.readyState === WebSocket.OPEN) {
        socket.value.send(JSON.stringify(message))
      }
    }, 3000)
  }

  const waitForConnection = (callback: () => void, interval: number) => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      callback()
    } else {
      setTimeout(() => {
        waitForConnection(callback, interval)
      }, interval)
    }
  }

  const joinChannel = (channel: string, params: any) => {
    // Specify the actual type of 'params'
    send({
      command: 'subscribe',
      identifier: { channel, params },
    })
  }

  const leaveChannel = (channel: string) => {
    send({
      command: 'unsubscribe',
      identifier: { channel },
    })
  }

  return {
    connect,
    disconnect,
    send,
    socket,
    joinChannel,
    leaveChannel,
  }
}

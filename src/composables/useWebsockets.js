import { useAuthStore } from '@/stores/auth'
import { useWebsocketStore } from '@/stores/websocket.ts'
import { ref } from 'vue'

export function useWebSocket() {
  const authStore = useAuthStore()
  const websocketStore = useWebsocketStore()
  const socket = ref(null)
  const token = ref('')
  const isConnected = ref(false)
  const url = import.meta.env.VITE_WS_BASE_URL

  const connect = () => {
    token.value = authStore.token
    socket.value = new WebSocket(`${url}?Authorization=${token.value}`)

    socket.value.addEventListener('open', function () {
      isConnected.value = true
    })

    socket.value.addEventListener('close', function () {
      isConnected.value = false
    })

    socket.value.addEventListener('message', function (event) {
      websocketStore.handleMessage(event)
    })

    return socket.value
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.close()
    }
  }

  const send = (message) => {
    waitForConnection(() => {
      if (socket.value && socket.value.readyState === WebSocket.OPEN) {
        socket.value.send(JSON.stringify(message))
      }
    }, 3000)
  }

  const waitForConnection = (callback, interval) => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      callback()
    } else {
      setTimeout(() => {
        waitForConnection(callback, interval)
      }, interval)
    }
  }

  const joinChannel = (channel) => {
    send({
      command: 'subscribe',
      identifier: { channel },
    })
  }

  const leaveChannel = (channel) => {
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

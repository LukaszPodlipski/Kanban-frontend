import { Ref, computed, onMounted, onUnmounted, ref } from 'vue'

export default function useResizableTable() {
  onMounted(async () => {
    window.addEventListener('resize', onResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', onResize)
  })

  const windowHeight = computed(() => Math.max(window.innerHeight, 300))

  const tableHeight: Ref<string> = ref(`${windowHeight.value - 78}px`)

  const onResize = () => {
    tableHeight.value = `${windowHeight.value - 78}px`
  }

  return { tableHeight }
}

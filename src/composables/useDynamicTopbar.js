import { useRoute } from 'vue-router'
import ProjectTopbar from '@/components/layout/topbar/components/ProjectTopbar.vue'
import ExploreTopbar from '@/components/layout/topbar/components/ExploreTopbar.vue'
import DefaultTopbar from '@/components/layout/topbar/components/DefaultTopbar.vue'

export function component() {
  const route = useRoute()
  const routeName = route.name

  const componentMap = {
    Explore: ExploreTopbar,
    Project: ProjectTopbar,
  }

  return componentMap[routeName] || DefaultTopbar
}

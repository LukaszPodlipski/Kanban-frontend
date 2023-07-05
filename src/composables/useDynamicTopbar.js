import { useRoute } from 'vue-router'
import ProjectTopbar from '@/components/layout/topbar/variants/ProjectTopbar.vue'
import ExploreTopbar from '@/components/layout/topbar/variants/ExploreTopbar.vue'
import DefaultTopbar from '@/components/layout/topbar/variants/DefaultTopbar.vue'

export function component() {
  const route = useRoute()
  const routeName = route.name

  const componentMap = {
    Explore: ExploreTopbar,
    Project: ProjectTopbar,
  }

  return componentMap[routeName] || DefaultTopbar
}

import { useRoute } from 'vue-router'
import ProjectTopbar from '@/components/layout/topbar/variants/ProjectTopbar.vue'
import ExploreTopbar from '@/components/layout/topbar/variants/ExploreTopbar.vue'
import DefaultTopbar from '@/components/layout/topbar/variants/DefaultTopbar.vue'
import ProjectBacklogTopbar from '@/components/layout/topbar/variants/ProjectBacklogTopbar.vue'

export function component() {
  const route = useRoute()
  const routeName = route.name

  const componentMap = {
    Explore: ExploreTopbar,
    Project: ProjectTopbar,
    ProjectBacklog: ProjectBacklogTopbar,
  }

  return componentMap[routeName] || DefaultTopbar
}

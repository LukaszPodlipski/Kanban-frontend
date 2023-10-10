import { useRoute } from 'vue-router'
import DefaultTopbar from '@/components/layout/topbar/variants/DefaultTopbar.vue'
import ProjectTopbar from '@/components/layout/topbar/variants/ProjectTopbar.vue'
import ExploreTopbar from '@/components/layout/topbar/variants/ExploreTopbar.vue'
import ProjectBacklogTopbar from '@/components/layout/topbar/variants/ProjectBacklogTopbar.vue'
import MembersTopbar  from '@/components/layout/topbar/variants/MembersTopbar.vue'

export function component() {
  const route = useRoute()
  const routeName = route.name

  const componentMap = {
    Explore: ExploreTopbar,
    Project: ProjectTopbar,
    ProjectBacklog: ProjectBacklogTopbar,
    ProjectMembers: MembersTopbar
  }

  return componentMap[routeName] || DefaultTopbar
}

import BoardTopbar from '@/components/layout/topbar/variants/BoardTopbar.vue'
import DefaultTopbar from '@/components/layout/topbar/variants/DefaultTopbar.vue'
import ExploreTopbar from '@/components/layout/topbar/variants/ExploreTopbar.vue'
import ProjectBacklogTopbar from '@/components/layout/topbar/variants/ProjectBacklogTopbar.vue'
import ProjectMembersTopbar from '@/components/layout/topbar/variants/ProjectMembersTopbar.vue'
import ProjectSettingsTopbar from '@/components/layout/topbar/variants/ProjectSettingsTopbar.vue'
import { useRoute } from 'vue-router'

export function component() {
  const route = useRoute()
  const routeName = route.name

  const componentMap = {
    Explore: ExploreTopbar,
    Board: BoardTopbar,
    ProjectBacklog: ProjectBacklogTopbar,
    ProjectMembers: ProjectMembersTopbar,
    ProjectSettings: ProjectSettingsTopbar,
  }

  return componentMap[routeName] || DefaultTopbar
}

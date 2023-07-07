import { useRoute } from 'vue-router'
import AccountIcon from '@/components/icons/AccountIcon.vue'
import BoardIcon from '@/components/icons/BoardIcon.vue'
import BoardsIcon from '@/components/icons/BoardsIcon.vue'
import ExploreIcon from '@/components/icons/ExploreIcon.vue'
import LogoutIcon from '@/components/icons/LogoutIcon.vue'
import MembersIcon from '@/components/icons/MembersIcon.vue'
import NewBoardIcon from '@/components/icons/NewBoardIcon.vue'
import PreferencesIcon from '@/components/icons/PreferencesIcon.vue'
import ProjectIcon from '@/components/icons/ProjectIcon.vue'
import SettingsIcon from '@/components/icons/SettingsIcon.vue'
import StatisticsIcon from '@/components/icons/StatisticsIcon.vue'
import UserIcon from '@/components/icons/UserIcon.vue'


export function iconComponent(iconName) {

  const componentMap = {
    AccountIcon: AccountIcon,
    BoardIcon: BoardIcon,
    BoardsIcon: BoardsIcon,
    ExploreIcon: ExploreIcon,
    LogoutIcon: LogoutIcon,
    MembersIcon: MembersIcon,
    NewBoardIcon: NewBoardIcon,
    PreferencesIcon: PreferencesIcon,
    ProjectIcon: ProjectIcon,
    SettingsIcon: SettingsIcon,
    StatisticsIcon: StatisticsIcon,
    UserIcon: UserIcon,
  }

  return componentMap[iconName]
}

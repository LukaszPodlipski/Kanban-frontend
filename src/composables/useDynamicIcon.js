import AccountIcon from '@/components/icons/AccountIcon.vue'
import BacklogIcon from '@/components/icons/BacklogIcon.vue'
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
    AccountIcon,
    BacklogIcon,
    BoardIcon,
    BoardsIcon,
    ExploreIcon,
    LogoutIcon,
    MembersIcon,
    NewBoardIcon,
    PreferencesIcon,
    ProjectIcon,
    SettingsIcon,
    StatisticsIcon,
    UserIcon,
  }

  return componentMap[iconName]
}

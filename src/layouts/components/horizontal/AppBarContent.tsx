// src/layouts/components/horizontal/AppBarContent.tsx

// ** MUI Imports
import Box from '@mui/material/Box'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Components
import Autocomplete from 'src/layouts/components/Autocomplete'
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import LanguageDropdown from 'src/@core/layouts/components/shared-components/LanguageDropdown'
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown'
import ShortcutsDropdown, { ShortcutsType } from 'src/@core/layouts/components/shared-components/ShortcutsDropdown'

// ** Hook Imports
import { useAuth } from 'src/hooks/useAuth'
import { useAnnounce } from 'src/hooks/useAnnounce'

interface Props {
  hidden: boolean
  settings: Settings
  saveSettings: (values: Settings) => void
}

const shortcuts: ShortcutsType[] = [
  {
    title: 'Users',
    url: '/apps/user/list',
    subtitle: 'Manage Users',
    icon: 'mdi:account-outline'
  },
  {
    url: '/apps/roles',
    title: 'Role Management',
    subtitle: 'Permissions',
    icon: 'mdi:shield-check-outline'
  },
  {
    url: '/',
    title: 'Dashboard',
    icon: 'mdi:chart-pie',
    subtitle: 'User Dashboard'
  },
  {
    title: 'Settings',
    icon: 'mdi:cog-outline',
    subtitle: 'Account Settings',
    url: '/pages/account-settings/account'
  },
  {
    title: 'Dialogs',
    subtitle: 'Useful Dialogs',
    icon: 'mdi:window-maximize',
    url: '/pages/dialog-examples'
  }
]

const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, saveSettings } = props

  // ** Hook
  const auth = useAuth()
  const announcements = useAnnounce()

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {auth.user && <Autocomplete hidden={hidden} settings={settings} />}
      <LanguageDropdown settings={settings} saveSettings={saveSettings} />
      <ModeToggler settings={settings} saveSettings={saveSettings} />
      {auth.user && (
        <>
          <ShortcutsDropdown settings={settings} shortcuts={shortcuts} />
          <NotificationDropdown settings={settings} notifications={announcements} />
          <UserDropdown settings={settings} />
        </>
      )}
    </Box>
  )
}

export default AppBarContent

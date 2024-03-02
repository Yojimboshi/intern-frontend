// src\@core\context\settingsContext.tsx
import { createContext, useState, ReactNode, useEffect } from 'react'
import { Direction } from '@mui/material'
import { useTranslation } from 'react-i18next';
import themeConfig from 'src/configs/themeConfig'
import { Skin, Mode, AppBar, Footer, ThemeColor, ContentWidth, VerticalNavToggle } from 'src/@core/layouts/types'

export type Settings = {
  skin: Skin
  mode: Mode
  appBar?: AppBar
  footer?: Footer
  navHidden?: boolean // navigation menu
  appBarBlur: boolean
  direction: Direction
  navCollapsed: boolean
  themeColor: ThemeColor
  contentWidth: ContentWidth
  layout?: 'vertical' | 'horizontal'
  lastLayout?: 'vertical' | 'horizontal'
  language: string;
  verticalNavToggleType: VerticalNavToggle
  toastPosition?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
}

export type PageSpecificSettings = {
  skin?: Skin
  mode?: Mode
  appBar?: AppBar
  footer?: Footer
  navHidden?: boolean // navigation menu
  appBarBlur?: boolean
  direction?: Direction
  navCollapsed?: boolean
  themeColor?: ThemeColor
  contentWidth?: ContentWidth
  layout?: 'vertical' | 'horizontal'
  lastLayout?: 'vertical' | 'horizontal'
  verticalNavToggleType?: VerticalNavToggle
  toastPosition?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
}
export type SettingsContextValue = {
  settings: Settings
  saveSettings: (updatedSettings: Settings) => void
}

interface SettingsProviderProps {
  children: ReactNode
  pageSettings?: PageSpecificSettings | void
}

const initialSettings: Settings = {
  themeColor: 'primary',
  language: 'en',
  mode: themeConfig.mode,
  skin: themeConfig.skin,
  footer: themeConfig.footer,
  layout: themeConfig.layout,
  lastLayout: themeConfig.layout,
  direction: themeConfig.direction,
  navHidden: themeConfig.navHidden,
  appBarBlur: themeConfig.appBarBlur,
  navCollapsed: themeConfig.navCollapsed,
  contentWidth: themeConfig.contentWidth,
  toastPosition: themeConfig.toastPosition,
  verticalNavToggleType: themeConfig.verticalNavToggleType,
  appBar: themeConfig.layout === 'horizontal' && themeConfig.appBar === 'hidden' ? 'fixed' : themeConfig.appBar
}

const staticSettings = {
  appBar: initialSettings.appBar,
  footer: initialSettings.footer,
  layout: initialSettings.layout,
  navHidden: initialSettings.navHidden,
  lastLayout: initialSettings.lastLayout,
  toastPosition: initialSettings.toastPosition
}

const restoreSettings = (): Settings | null => {
  let settings = null
  try {
    const storedData: string | null = window.localStorage.getItem('settings')
    if (storedData) {
      settings = { ...JSON.parse(storedData), ...staticSettings };
    } else {
      settings = initialSettings
    }
  } catch (err) {
    console.error(err)
  }

  return settings
}

// set settings in localStorage
const storeSettings = (settings: Settings) => {
  const initSettings = Object.assign({}, settings)

  delete initSettings.appBar
  delete initSettings.footer
  delete initSettings.navHidden
  delete initSettings.toastPosition
  window.localStorage.setItem('settings', JSON.stringify(initSettings))
}

// ** Create Context
export const SettingsContext = createContext<SettingsContextValue>({
  saveSettings: () => null,
  settings: initialSettings
})

export const SettingsProvider = ({ children, pageSettings }: SettingsProviderProps) => {
  const { i18n } = useTranslation();
  const [settings, setSettings] = useState<Settings>({ ...initialSettings })

  useEffect(() => {
    const restoredSettings = restoreSettings()
    if (restoredSettings) {
      setSettings({ ...restoredSettings })
      if (restoredSettings.language && i18n.language !== restoredSettings.language) {
        i18n.changeLanguage(restoredSettings.language);
      }
    }
    if (pageSettings) {
      setSettings({ ...settings, ...pageSettings })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSettings, i18n])

  useEffect(() => {
    if (settings.layout === 'horizontal' && settings.mode === 'semi-dark') {
      saveSettings({ ...settings, mode: 'light' })
    }
    if (settings.layout === 'horizontal' && settings.appBar === 'hidden') {
      saveSettings({ ...settings, appBar: 'fixed' })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.layout])

  const saveSettings = (updatedSettings: Settings) => {
    console.log(`Saving settings: `, updatedSettings);
    storeSettings(updatedSettings);
    setSettings(updatedSettings);
  }

  return <SettingsContext.Provider value={{ settings, saveSettings }}>{children}</SettingsContext.Provider>
}

export const SettingsConsumer = SettingsContext.Consumer

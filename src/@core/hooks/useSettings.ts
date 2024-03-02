// src\@core\hooks\useSettings.ts
import { useContext } from 'react'
import { SettingsContext, SettingsContextValue } from 'src/@core/context/settingsContext'

export const useSettings = (): SettingsContextValue => useContext(SettingsContext)

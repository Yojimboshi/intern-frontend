// src\@core\layouts\components\shared-components\LanguageDropdown.tsx
import { useEffect } from 'react'
import Icon from 'src/@core/components/icon'
import { useTranslation } from 'react-i18next'
import OptionsMenu from 'src/@core/components/option-menu'
import { Settings } from 'src/@core/context/settingsContext'
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';

type LanguageCode = 'en' | 'cn' | 'fr' | 'id' | 'th' | 'kr' | 'vn';

interface Props {
  settings: Settings
  saveSettings: (values: Settings) => void
}

const languageOptions: { code: LanguageCode, name: string, flagIcon: string }[] = [
  { code: 'en', name: 'English', flagIcon: 'emojione:flag-for-united-states' },
  { code: 'cn', name: 'Chinese', flagIcon: 'emojione:flag-for-china' },
  { code: 'fr', name: 'French', flagIcon: 'emojione:flag-for-france' },
  { code: 'id', name: 'Indonesian', flagIcon: 'emojione:flag-for-indonesia' },
  { code: 'th', name: 'Thai', flagIcon: 'emojione:flag-for-thailand' },
  { code: 'kr', name: 'Korean', flagIcon: 'emojione:flag-for-south-korea' },
  { code: 'vn', name: 'Vietnamese', flagIcon: 'emojione:flag-for-vietnam' },
];


const LanguageDropdown = ({ settings, saveSettings }: Props) => {
  // ** Hook
  const { i18n, t } = useTranslation()
  const { layout } = settings

  const handleLangItemClick = (lang: LanguageCode) => {
    i18n.changeLanguage(lang);
    saveSettings({ ...settings, language: lang });
  }
  useEffect(() => {
    document.documentElement.setAttribute('lang', i18n.language)
  }, [i18n.language]);

  return (
    <OptionsMenu
      icon={<Icon icon='mdi:translate' />}
      menuProps={{ sx: { '& .MuiMenu-paper': { mt: 4, minWidth: 130 } } }}
      iconButtonProps={{ color: 'inherit', sx: { ...(layout === 'vertical' ? { mr: 0.75 } : { mx: 0.75 }) } }}
      options={languageOptions.map((language) => ({
        text: (
          <>
            <Icon icon={language.flagIcon} style={{ marginRight: '8px' }} />
            {t(language.name)}
          </>
        ),
        menuItemProps: {
          sx: { py: 2 },
          selected: i18n.language === language.code,
          onClick: () => handleLangItemClick(language.code)
        }
      }))}
    />
  );
};

export default LanguageDropdown

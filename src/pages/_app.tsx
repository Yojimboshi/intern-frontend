// src\pages\_app.tsx
import React, { ReactNode } from 'react'
import Head from 'next/head'
import { Router } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/cache'
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'
import { Provider } from 'react-redux'
import { store } from 'src/store'
import { AuthProvider } from 'src/context/AuthContext'
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'
import NProgress from 'nprogress'
import { Toaster } from 'react-hot-toast'
import UserLayout from 'src/layouts/UserLayout'
import AclGuard from 'src/@core/components/auth/AclGuard'
import ThemeComponent from 'src/@core/theme/ThemeComponent'
import AuthGuard from 'src/@core/components/auth/AuthGuard'
import GuestGuard from 'src/@core/components/auth/GuestGuard'
import Spinner from 'src/@core/components/spinner'
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast'

// ** Config & Global Styles Imports
import 'src/configs/i18n'
import { defaultACLObj } from 'src/configs/acl'
import themeConfig from 'src/configs/themeConfig'
import '../../styles/globals.css'

// ** Prismjs & Third-party Styles
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'react-perfect-scrollbar/dist/css/styles.css'
import 'src/iconify-bundle/icons-bundle-react'

import { useTranslation } from 'react-i18next';

type ExtendedAppProps = AppProps & {
  Component: NextPage
  emotionCache: EmotionCache
}

type GuardProps = {
  authGuard: boolean
  guestGuard: boolean
  children: ReactNode
}

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', (url) => {
    console.debug('Starting route change to:', url);
    NProgress.start();
  });
  Router.events.on('routeChangeError', (err, url) => {
    console.debug('Error changing route to:', url, 'Error:', err);
    NProgress.done();
  });
  Router.events.on('routeChangeComplete', (url) => {
    console.debug('Completed route change to:', url);
    NProgress.done();
  });
}

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) {

    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {

    return <>{children}</>
  } else {

    return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>
  }
}

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false
  const getLayout =
    Component.getLayout ?? (page => {
      // Add debug log here

      return <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>;
    });

  const setConfig = Component.setConfig ?? undefined
  const authGuard = Component.authGuard ?? true
  const guestGuard = Component.guestGuard ?? false
  const aclAbilities = Component.acl ?? defaultACLObj

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>{`${themeConfig.templateName} - DEMO 示版`}</title>
          <meta
            name='description'
            content={`${themeConfig.templateName} DEMO 示版 `}
          />
          <meta name='keywords' content='DEMO 示版' />
          <meta name='viewport' content='initial-scale=1, width=device-width' />
        </Head>

        <AuthProvider>
          <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
            <SettingsConsumer>
              {({ settings }) => {
                return (
                  <ThemeComponent settings={settings}>
                    <Guard authGuard={authGuard} guestGuard={guestGuard}>
                      <AclGuard aclAbilities={aclAbilities} guestGuard={guestGuard} authGuard={authGuard}>
                        {getLayout(<Component {...pageProps} />)}
                      </AclGuard>
                    </Guard>
                    <ReactHotToast>
                      <Toaster position={settings.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
                    </ReactHotToast>
                  </ThemeComponent>
                )
              }}
            </SettingsConsumer>
          </SettingsProvider>
        </AuthProvider>
      </CacheProvider>
    </Provider>
  )
}

export default App

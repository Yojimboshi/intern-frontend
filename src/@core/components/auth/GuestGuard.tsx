// src\@core\components\auth\GuestGuard.tsx
import { ReactNode, ReactElement, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'

interface GuestGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const GuestGuard = (props: GuestGuardProps) => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) {
      console.debug('Router is not ready. Waiting...')

      return
    }

    if (window.localStorage.getItem('userData')) {
      console.debug('User data found in local storage. Redirecting to home.')
      router.replace('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.route])

  if (auth.loading || (!auth.loading && auth.user !== null)) {
    console.debug('Authentication loading or user already authenticated. Showing fallback.')

    return fallback
  }

  return <>{children}</>
}

export default GuestGuard

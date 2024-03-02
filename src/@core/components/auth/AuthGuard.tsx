// src\@core\components\auth\AuthGuard.tsx
import { ReactNode, ReactElement, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props;
  const auth = useAuth();
  const router = useRouter();

  // Log when component is rendered
  console.debug('AuthGuard rendered. Route:', router.route, 'Auth State:', auth);

  useEffect(() => {
    // Log when useEffect is triggered
    console.debug('AuthGuard useEffect triggered. Route:', router.route);

    if (!router.isReady) {
      console.debug('Router is not ready. Waiting...');

      return;
    }

    console.debug('Checking authentication... User:', auth.user, 'LocalStorage:', window.localStorage.getItem('userData'));

    if (auth.user === null && !window.localStorage.getItem('userData')) {
      console.debug('User not authenticated. Checking redirection path...');
      if (router.asPath !== '/') {
        const targetPath = {
          pathname: '/login',
          query: { returnUrl: router.asPath }
        };
        console.debug('Redirecting to login with returnUrl:', router.asPath);
        router.replace(targetPath);
      } else {
        console.debug('Redirecting to login.');
        router.replace('/login');
      }
    } else {
      console.debug('User is authenticated or data found in local storage.');
    }
  }, [router.route]);

  if (auth.loading || auth.user === null) {
    console.debug('Authentication loading or user not present. Showing fallback.');

    return fallback;
  }

  console.debug('Rendering children.');

  return <>{children}</>;
}


export default AuthGuard

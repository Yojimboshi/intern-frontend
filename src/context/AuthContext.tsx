// src\context\AuthContext.tsx
import { createContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { AuthValuesType, LoginParams, ErrCallbackType, UserDataType } from './types'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const router = useRouter()

  useEffect(() => {
    initAuth();
  }, []);


  const initAuth = async (): Promise<void> => {
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);
    const isAdmin = window.localStorage.getItem('isAdmin') === 'true';
    const userEndpoint = isAdmin ? authConfig.adminMeEndpoint : authConfig.meEndpoint;

    if (storedToken) {
      setLoading(true);
      try {
        const response = await axios.get(userEndpoint, {
          headers: { Authorization: storedToken }
        });
        const userData = response.data;
        setUser(userData);
        handleRedirects(userData);
      } catch (error) {
        handleAuthError();
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const handleRedirects = (userData: UserDataType) => {
    const currentPath = router.pathname;
    const isAdmin = window.localStorage.getItem('isAdmin') === 'true';
    if (userData.isAdmin || isAdmin) {
      return; // Admin bypasses other checks
    }
    if (!userData.emailVerified && currentPath !== '/pages/auth/verify-email-v1') {
      router.replace('/pages/auth/verify-email-v1');
    } else if (!userData.registrationComplete && currentPath !== '/register/complete-registration') {
      router.replace('/register/complete-registration');
    } else if (!userData.packageActivated && currentPath !== '/register/complete-registration/activatePackage') {
      router.replace('/register/complete-registration/activatePackage');
    }
  };

  const handleAuthError = () => {
    setUser(null);
    window.localStorage.removeItem('userData');
    window.localStorage.removeItem(authConfig.storageTokenKeyName);
    router.replace('/login');
  };

  const handleLogin = async (params: LoginParams, errorCallback?: ErrCallbackType) => {
    const isOnAdminRoute = router.pathname.includes('/admin');
    const loginEndpoint = isOnAdminRoute ? authConfig.adminLoginEndpoint : authConfig.loginEndpoint;

    if (isOnAdminRoute) {
      window.localStorage.setItem('isAdmin', 'true');
    } else {
      window.localStorage.removeItem('isAdmin');
    }

    try {
      const response = await axios.post(loginEndpoint, params, { withCredentials: true });
      if (!response.data.accessToken) {
        if (router.pathname !== (isOnAdminRoute ? '/login/admin' : '/login')) {
          router.replace(isOnAdminRoute ? '/login/admin' : '/login');
        }
        return;
      }

      if (params.rememberMe) {
        window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken);
      }

      const userResponse = await axios.get(authConfig.meEndpoint, {
        headers: { Authorization: response.data.accessToken }
      });
      const userData = userResponse.data;
      setUser(userData);

      if (params.rememberMe) {
        window.localStorage.setItem('userData', JSON.stringify(userData));
      }

      handleRedirects(userData);
      const returnUrl = router.query.returnUrl;
      router.replace(returnUrl && returnUrl !== '/' ? (returnUrl as string) : '/');
    } catch (err: any) {
      if (errorCallback) errorCallback(err);
    }
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem('userData');
    window.localStorage.removeItem(authConfig.storageTokenKeyName);
    router.push('/login');
  };


  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }

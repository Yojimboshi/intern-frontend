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
  refreshUser: () => Promise.resolve(),
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
    console.log("AuthProvider mounted");
    initAuth();
  }, []);

  const initAuth = async (): Promise<void> => {
    console.log("initAuth called");
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);
    const isAdmin = window.localStorage.getItem('isAdmin') === 'true';
    const userEndpoint = isAdmin ? authConfig.adminMeEndpoint : authConfig.meEndpoint;

    if (storedToken) {
      console.log("Stored token found, fetching user data...");
      setLoading(true);
      try {
        const response = await axios.get(userEndpoint, {
          headers: { Authorization: storedToken }
        });
        const userData = response.data;
        console.log("User data fetched successfully", userData);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data", error);
        handleAuthError();
      } finally {
        setLoading(false);
      }
    } else {
      console.log("No stored token found");
      setLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    console.log("refreshUser called");
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);
    const isAdmin = window.localStorage.getItem('isAdmin') === 'true';
    const userEndpoint = isAdmin ? authConfig.adminMeEndpoint : authConfig.meEndpoint;

    if (storedToken) {
      console.log("Stored token found, refreshing user data...");
      try {
        const response = await axios.get(userEndpoint, {
          headers: { Authorization: storedToken },
        });
        const userData = response.data;
        console.log("User data refreshed successfully", userData);
        setUser(userData);
      } catch (error) {
        console.error("Error refreshing user data", error);
        handleAuthError();
      }
    }
  };

  const handleAuthError = () => {
    console.log("Handling authentication error, redirecting to login...");
    setUser(null);
    window.localStorage.removeItem('userData');
    window.localStorage.removeItem(authConfig.storageTokenKeyName);
    router.replace('/login');
  };

  const handleLogin = async (params: LoginParams, errorCallback?: ErrCallbackType) => {
    console.log("handleLogin called with params", params);
    const isOnAdminRoute = router.pathname.includes('/admin');
    const loginEndpoint = isOnAdminRoute ? authConfig.adminLoginEndpoint : authConfig.loginEndpoint;

    if (isOnAdminRoute) {
      window.localStorage.setItem('isAdmin', 'true');
    } else {
      window.localStorage.removeItem('isAdmin');
    }

    try {
      const response = await axios.post(loginEndpoint, params, { withCredentials: true });
      console.log("Login response", response);

      if (!response.data.accessToken) {
        console.warn("No access token received");
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
      console.log("User data after login", userData);
      setUser(userData);
      router.push('/');
      if (params.rememberMe) {
        window.localStorage.setItem('userData', JSON.stringify(userData));
      }
    } catch (err: any) {
      console.error("Login error", err);
      if (errorCallback) errorCallback(err);
    }
  };

  const handleLogout = () => {
    console.log("handleLogout called");
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
    refreshUser,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }

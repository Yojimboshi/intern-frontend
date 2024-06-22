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
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);
      const isAdmin = window.localStorage.getItem('isAdmin') === 'true';
      const userEndpoint = isAdmin ? authConfig.adminMeEndpoint : authConfig.meEndpoint;

      if (storedToken) {
        setLoading(true);
        try {
          const response = await axios.get(userEndpoint, {
            headers: {
              Authorization: storedToken
            }
          });
          setLoading(false);
          setUser({ ...response.data });

          // Redirect to registration completion if registration is not complete
          if (response.data.registrationComplete === false) {
            router.replace('/register/complete-registration');
          } else if (response.data.packageActivated === false) {
            router.replace('/register/complete-registration/activatePackage');
          }
        } catch (error) {
          setLoading(false);
          setUser(null);
          localStorage.removeItem('userData');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('isAdmin');
          router.replace(isAdmin ? '/login/admin' : '/login');
        }
      } else {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    const isOnAdminRoute = router.pathname.includes('/admin');
    const loginEndpoint = isOnAdminRoute ? authConfig.adminLoginEndpoint : authConfig.loginEndpoint;
    const userEndpoint = isOnAdminRoute ? authConfig.adminMeEndpoint : authConfig.meEndpoint;

    if (isOnAdminRoute) {
      window.localStorage.setItem('isAdmin', 'true');
    } else {
      window.localStorage.removeItem('isAdmin');
    }

    axios.post(loginEndpoint, params, {
      withCredentials: true  // Ensure that cookies are included with the request
    }).then(response => {
      if (!response.data.accessToken) {
        router.replace(isOnAdminRoute ? '/login/admin' : '/login');

        return; // End the promise chain here as there is no need to continue
      }

      if (params.rememberMe) {
        window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken);
      }

      // Making the axios call to meEndpoint after successful login
      return axios.get(userEndpoint, {
        headers: {
          Authorization: response.data.accessToken
        }
      });

    }).then(response => {
      if (response) {
        const returnUrl = router.query.returnUrl;
        setUser({ ...response.data });

        if (params.rememberMe) {
          window.localStorage.setItem('userData', JSON.stringify(response.data));
        }

        // Redirect to registration completion if registration is not complete
        if (response.data.registrationComplete === false) {
          router.replace('/register/complete-registration');
        } else if (response.data.packageActivated === false) {
          router.replace('/register/complete-registration/activatePackage');
        } else {
          const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/';
          router.replace(redirectURL as string);
        }
      }
    }).catch(err => {
      if (errorCallback) errorCallback(err);
    });
  };

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem('isAdmin')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

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

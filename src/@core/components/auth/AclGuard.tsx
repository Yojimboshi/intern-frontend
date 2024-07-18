// src\@core\components\auth\AclGuard.tsx
import React, { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { ACLObj, AppAbility } from 'src/configs/acl'
import { buildAbilityFor } from 'src/configs/acl'
import NotAuthorized from 'src/pages/401'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useAuth } from 'src/hooks/useAuth'
import getHomeRoute from 'src/layouts/components/acl/getHomeRoute'

interface AclGuardProps {
  children: ReactNode
  aclAbilities: ACLObj
  authGuard?: boolean
  guestGuard?: boolean
}

const AclGuard = (props: AclGuardProps) => {
  const { aclAbilities, children, guestGuard = false, authGuard = true } = props
  const auth = useAuth()
  const router = useRouter()

  // ** Vars
  let ability: AppAbility

  useEffect(() => {
    console.log("AclGuard");
    if (auth.user) {
      const redirectPath = ''

      // Perform additional checks for email verification, registration completion, and package activation if user is not an admin
      // if (auth.user.role !== 'admin') {
      //   if (!auth.user.emailVerified) {
      //     console.log("emailVerified");
      //     redirectPath = '/pages/auth/verify-email-v1'
      //   } else if (!auth.user.registrationComplete) {
      //     console.log("registrationComplete");
      //     redirectPath = '/register/complete-registration'
      //   } else if (!auth.user.packageActivated) {
      //     console.log("packageActivated");
      //     redirectPath = '/register/complete-registration/activatePackage'
      //   }
      // }

      if (redirectPath && router.pathname !== redirectPath) {
        router.replace(redirectPath)

        return
      }

      // Check role and redirect to home route if on root path
      if (auth.user.role && !guestGuard && router.route === '/') {
        const homeRoute = getHomeRoute(auth.user.role)
        router.replace(homeRoute)

        return
      }

      // Build ability for the user
      if (!ability) {
        ability = buildAbilityFor(auth.user.role, aclAbilities.subject)
        console.debug('Ability built for user:', ability)
      }
    }
  }, [auth.user, guestGuard, router, ability])

  if (auth.user && !ability) {
    ability = buildAbilityFor(auth.user.role, aclAbilities.subject)
    console.debug('Ability built for user:', ability)
  }

  if (guestGuard || !authGuard || ['/404', '/500'].includes(router.route)) {
    return auth.user && ability
      ? <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
      : <>{children}</>
  }

  if (ability && auth.user && ability.can(aclAbilities.action, aclAbilities.subject)) {
    console.debug('User has access to route:', router.route)

    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  }

  console.debug('User not authorized to access route:', router.route)

  return (
    <BlankLayout>
      <NotAuthorized />
    </BlankLayout>
  )
}

export default AclGuard

// src\layouts\components\acl\getHomeRoute.tsx
const getHomeRoute = (role: string) => {
  if (role === 'member') return '/dashboards/analytics'
  else return '/dashboards/analytics'
}

export default getHomeRoute

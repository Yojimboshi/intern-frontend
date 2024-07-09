// src\navigation\horizontal\index.ts
import { useContext } from 'react';
import { AuthContext } from 'src/context/AuthContext';
import { HorizontalNavItemsType } from 'src/@core/layouts/types';

const adminNavItems: HorizontalNavItemsType = [
  {
    icon: 'mdi:home-outline',
    title: 'Dashboards',
    badgeContent: 'ADMIN',
    badgeColor: 'info',
    path: '/dashboards/analytics'
  },

];

const userNavItems: HorizontalNavItemsType = [
  {
    icon: 'mdi:home-outline',
    title: 'Dashboards',
    path: '/dashboards/analytics'
  },
  {
    title: 'v2Pools',
    badgeContent: 'new',
    badgeColor: 'error',
    icon: 'icon-park-twotone:curve-adjustment',
    children: [
      {
        title: 'Pool List',
        icon: 'material-symbols:list',
        path: '/apps/v2Pools/PoolList'
      },
      {
        title: 'Swap',
        icon: 'ri:exchange-line',
        path: '/apps/v2Pools'
      },
    ]
  },

];

const Navigation = (): HorizontalNavItemsType => {
  const { user } = useContext(AuthContext);

  if (user && user.role === 'admin') {
    return adminNavItems;
  } else {
    return userNavItems;
  }
}

export default Navigation

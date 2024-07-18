// src\navigation\vertical\index.ts
import { useContext } from 'react';
import { AuthContext } from 'src/context/AuthContext';
import { VerticalNavItemsType } from 'src/@core/layouts/types';

const adminNavItems: VerticalNavItemsType = [
  {
    title: 'Dashboards',
    icon: 'mdi:home-outline',
    badgeContent: 'ADMIN',
    badgeColor: 'info',
    path: '/dashboards/analytics'
  },

  {
    title: 'V2Pools',
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
  {
    title: 'Announcements',
    icon: 'mdi:announcement-outline',
    path: '/apps/announcement/admin'
  }

];

const userNavItems: VerticalNavItemsType = [
  {
    title: 'Dashboards',
    icon: 'mdi:home-outline',
    badgeContent: 'new',
    badgeColor: 'error',
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
  {
    title: 'Announcements',
    icon: 'mdi:announcement-outline',
    path: '/apps/announcement'
  }

];

const Navigation = (): VerticalNavItemsType => {
  const { user } = useContext(AuthContext);

  if (user && user.role === 'admin') {
    return adminNavItems;
  } else {
    return userNavItems;
  }
}

export default Navigation

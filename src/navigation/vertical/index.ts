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
    title: 'User',
    icon: 'mdi:account-outline',
    children: [
      {
        title: 'List',
        path: '/apps/user/list'
      },
      {
        title: 'View',
        children: [
          {
            title: 'Overview',
            path: '/apps/user/view/overview'
          },
          {
            title: 'Security',
            path: '/apps/user/view/security'
          },
          {
            title: 'Payment Setting',
            path: '/apps/user/view/payment-setting'
          },
          {
            title: 'Notifications',
            path: '/apps/user/view/notification'
          },
          {
            title: 'Connection',
            path: '/apps/user/view/connection'
          }
        ]
      }
    ]
  },
  {
    title: 'Announcements',
    icon: 'mdi:announcement-outline',
    path: '/apps/announcement/admin'
  },
  {
    title: 'Avatars',
    icon: 'mdi:account-edit-outline',
    children: [
      {
        title: 'CRUD Avatar',
        path: '/apps/avatars'
      },
      {
        title: 'List Avatars',
        path: '/apps/avatars/list'
      },
    ]
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
    title: 'User',
    icon: 'mdi:account-outline',
    children: [
      {
        title: 'Overview',
        path: '/apps/user/view/overview'
      },
      {
        title: 'Security',
        path: '/apps/user/view/security'
      },
      {
        title: 'Payment Setting',
        path: '/apps/user/view/payment-setting'
      },
      {
        title: 'Notifications',
        path: '/apps/user/view/notification'
      },
      {
        title: 'Connection',
        path: '/apps/user/view/connection'
      }
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

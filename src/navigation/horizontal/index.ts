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
        title: 'Avatar Editor',
        path: '/apps/avatars'
      },
      {
        title: 'List Avatars',
        path: '/apps/avatars/list'
      },
    ]
  },
  {
    title: 'Chat Channel Editor',
    icon: 'mdi:announcement-outline',
    path: '/apps/chatChannel/admin'
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
  },
  {
    title: 'Chat Channel',
    icon: 'mdi:announcement-outline',
    path: '/apps/chatChannel'
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

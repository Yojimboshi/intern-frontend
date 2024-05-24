// src\navigation\horizontal\index.ts
import { useContext } from 'react';
import { AuthContext } from 'src/context/AuthContext';
import { HorizontalNavItemsType } from 'src/@core/layouts/types';

const adminNavItems: HorizontalNavItemsType = [
  {
    icon: 'mdi:home-outline',
    title: 'Dashboards',
    path: '/dashboards/analytics'
  },
  {
    icon: 'mdi:apps',
    title: 'Apps',
    children: [
      {
        title: 'User Management',
        icon: 'mdi:account-outline',
        children: [
          {
            title: 'User List',
            path: '/apps/user/list'
          },
        ]
      },
      {
        title: 'My Account',
        icon: 'mdi:account-circle-outline',
        children: [
          {
            title: 'Overview',
            path: '/apps/user/view/overview'
          },
          {
            title: 'Security Settings',
            path: '/apps/user/view/security'
          },
          {
            title: 'Payment Settings',
            path: '/apps/user/view/payment-setting'
          },
          {
            title: 'Notifications',
            path: '/apps/user/view/notification'
          },
          {
            title: 'Connections',
            path: '/apps/user/view/connection'
          },
        ]
      },
    ]
  },
  {
    title: 'Mining',
    badgeContent: 'new',
    badgeColor: 'error',
    icon: 'mdi:pickaxe',
    children: [
      {
        title: 'User Mining Stats',
        path: '/apps/mining/admin/stats'
      },
      {
        title: 'Mining Transactions',
        path: '/apps/mining/admin/transactions'
      }
    ]
  },
  {
    title: 'v2Pools',
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
    title: 'Wallet',
    icon: 'mdi:wallet',
    children: [
      {
        title: 'Crypto Wallet',
        icon: 'mdi:wallet',
        path: '/apps/wallet/cryptoWallet',
      },
      {
        title: 'E-Wallet',
        icon: 'arcticons:bluewallet',
        path: '/apps/wallet/eWallet'
      },
    ]
  },
  {
    title: 'Report & Transaction',
    icon: 'mdi:file-document-outline',
    path: 'apps/report'
  },
  {
    title: 'Roles & Permissions',
    icon: 'mdi:shield-outline',
    children: [
      {
        title: 'Roles',
        path: '/apps/roles'
      },
      {
        title: 'Permissions',
        path: '/apps/permissions'
      }
    ]
  }
];

const userNavItems: HorizontalNavItemsType = [
  {
    icon: 'mdi:home-outline',
    title: 'Dashboards',
    path: '/dashboards/analytics'
  },
  {
    icon: 'mdi:apps',
    title: 'Apps',
    children: [
      {
        title: 'Hierarchy',
        icon: 'mdi:account-group',
        children: [
          {
            title: 'Tree',
            icon: 'tabler:binary-tree-2',
            path: '/apps/hierarchy'
          },
          {
            title: 'My Sponsors',
            icon: 'octicon:sponsor-tiers-16',
            path: '/apps/hierarchy/mySponsors'
          },
          {
            title: 'Add',
            icon: 'gg:add',
            path: '/apps/hierarchy/addUser'
          },
          {
            title: 'Edit',
            icon: 'mdi:account-edit',
            path: '/apps/hierarchy/editUser'
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
    ]
  },
  {
    title: 'Mining',
    badgeContent: 'new',
    badgeColor: 'error',
    icon: 'mdi:pickaxe',
    children: [
      {
        title: 'Mining Stats',
        path: '/apps/mining/stats'
      },
      {
        title: 'Mining Transactions',
        path: '/apps/mining/transactions'
      }
    ]
  },
  {
    title: 'v2Pools',
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
    title: 'Wallet',
    icon: 'mdi:wallet',
    children: [
      {
        title: 'Crypto Wallet',
        icon: 'mdi:wallet',
        path: '/apps/wallet/cryptoWallet',
      },
      {
        title: 'E-Wallet',
        icon: 'arcticons:bluewallet',
        path: '/apps/wallet/eWallet'
      },
    ]
  },
  {
    title: 'Report & Transaction',
    icon: 'mdi:file-document-outline',
    path: 'apps/report'
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

// src\navigation\vertical\index.ts
import { useContext } from 'react';
import { AuthContext } from 'src/context/AuthContext';
import { VerticalNavItemsType } from 'src/@core/layouts/types';

const adminNavItems: VerticalNavItemsType = [
  {
    title: 'Dashboards',
    icon: 'mdi:home-outline',
    badgeContent: 'new',
    badgeColor: 'error',
    path: '/dashboards/analytics'
  },
  {
    sectionTitle: 'Apps & Pages'
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
    title: 'Mining',
    badgeContent: 'new',
    badgeColor: 'error',
    icon: 'mdi:pickaxe',
    path: '/apps/mining/admin',
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
    path: '/apps/report'
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
  },
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
    sectionTitle: 'Apps & Pages'
  },
  {
    title: 'My Group',
    icon: 'mdi:account-group',
    children: [
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
        title: 'Referral Program',
        icon: 'mdi:share-variant',
        path: '/apps/hierarchy/referralProgram'
      }
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
    title: 'Mining',
    badgeContent: 'new',
    badgeColor: 'error',
    icon: 'mdi:pickaxe',
    path: '/apps/mining',
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
    path: '/apps/report'
  },
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

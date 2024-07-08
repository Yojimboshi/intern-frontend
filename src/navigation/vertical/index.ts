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

];

const userNavItems: VerticalNavItemsType = [
  {
    title: 'Dashboards',
    icon: 'mdi:home-outline',
    badgeContent: 'new',
    badgeColor: 'error',
    path: '/dashboards/analytics'
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

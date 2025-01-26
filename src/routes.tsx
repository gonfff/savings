import { menuRoute } from '@/types/sidebar';
import { lazy } from 'solid-js';

export const Routes: menuRoute[] = [
  {
    name: 'Dashboard',
    path: '/',
    component: lazy(() => import('@/pages/dashboard')),
  },
  {
    name: 'Accounts',
    path: '/accounts',
    component: lazy(() => import('@/pages/accounts/page')),
  },
  {
    name: 'Exchange Rates',
    path: '/exchange-rates',
    component: lazy(() => import('@/pages/exchange-rates')),
  },
  {
    name: 'Settings',
    path: '/settings',
    component: lazy(() => import('@/pages/settings')),
  },
];

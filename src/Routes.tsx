import { Component, lazy } from 'solid-js';

export interface menuRoute {
  name: string;
  path: string;
  component: Component;
}

export const Routes: menuRoute[] = [
  {
    name: 'Dashboard',
    path: '/',
    component: lazy(() => import('./pages/dashboard.tsx')),
  },
  {
    name: 'Accounts',
    path: '/accounts',
    component: lazy(() => import('./pages/accounts.tsx')),
  },
  {
    name: 'Exchange Rates',
    path: '/exchange-rates',
    component: lazy(() => import('./pages/exchange-rates.tsx')),
  },
  {
    name: 'Settings',
    path: '/settings',
    component: lazy(() => import('./pages/settings.tsx')),
  },
];

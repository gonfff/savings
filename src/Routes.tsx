import { Component, lazy } from "solid-js";

export interface menuRoute {
  name: string;
  path: string;
  component: Component;
}

export const Routes: menuRoute[] = [
  {
    name: "Dashboard",
    path: "/",
    component: lazy(() => import("./pages/Dashboard")),
  },
  {
    name: "Accounts",
    path: "/accounts",
    component: lazy(() => import("./pages/Accounts")),
  },
  {
    name: "Exchange Rates",
    path: "/exchange-rates",
    component: lazy(() => import("./pages/ExchangeRates")),
  },
  {
    name: "Settings",
    path: "/settings",
    component: lazy(() => import("./pages/Settings")),
  },
];

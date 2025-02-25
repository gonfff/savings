import { JSX } from 'solid-js';

export enum settingsMenuItems {
  General = 'General',
  Assets = 'Assets',
  Locations = 'Locations',
  Accounts = 'Accounts',
  Appearance = 'Appearance',
  Creds = 'Creds & Support',
}

export interface SettingsMenuProps {
  selectedMenu: () => string;
  setSelectedMenu: (menu: string) => void;
}

export interface SettingsCardProps {
  title: string;
  description: string;
  children: JSX.Element;
}

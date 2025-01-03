import { JSX } from 'solid-js';

export enum settingsMenuItems {
  General = 'General',
  Locations = 'Locations',
  Assets = 'Assets',
  Appearance = 'Appearance',
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

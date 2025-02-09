import { ReloadProvider } from '@/components/contexts/reload';
import { AddLocationButton, LocationsPage } from '@/pages/settings/locations';

import { settingsMenuItems, SettingsMenuProps } from '@/types/settings';

import { PageHeader } from '@/components/header';
import { createSignal, For, Match, Switch } from 'solid-js';
import { AccountsPage, AddAccountButton } from './accounts';
import { AppearancePage } from './appearance';
import { AddAssetButton, AssetsPage } from './assets';
import { GeneralPage } from './general';
import { SupportPage } from './support';

const SettingsPage = () => {
  const [selectedMenu, setSelectedMenu] = createSignal(
    settingsMenuItems.General,
  );

  return (
    <ReloadProvider>
      <div class="flex flex-col mr-3 mt-3 h-screen">
        <SettingsHeader
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
        />
        <div class="flex-1 overflow-hidden">
          <SettingsContent
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
          />
        </div>
      </div>
    </ReloadProvider>
  );
};

export default SettingsPage;

const SettingsHeader = (props: SettingsMenuProps) => {
  return (
    <PageHeader title="Settings">
      <HeaderButtons {...props} />
    </PageHeader>
  );
};

const SettingsContent = (props: SettingsMenuProps) => {
  return (
    <div class="h-full grid grid-cols-[12rem_1fr]">
      <SettingsMenu
        selectedMenu={props.selectedMenu}
        setSelectedMenu={props.setSelectedMenu}
      />
      <Switch fallback={<div>Settings not found</div>}>
        <Match when={props.selectedMenu() === settingsMenuItems.General}>
          <GeneralPage />
        </Match>
        <Match when={props.selectedMenu() === settingsMenuItems.Locations}>
          <LocationsPage />
        </Match>
        <Match when={props.selectedMenu() === settingsMenuItems.Accounts}>
          <AccountsPage />
        </Match>
        <Match when={props.selectedMenu() === settingsMenuItems.Appearance}>
          <AppearancePage />
        </Match>
        <Match when={props.selectedMenu() === settingsMenuItems.Assets}>
          <AssetsPage />
        </Match>
        <Match when={props.selectedMenu() === settingsMenuItems.Creds}>
          <SupportPage />
        </Match>
      </Switch>
    </div>
  );
};

const SettingsMenu = (props: SettingsMenuProps) => {
  return (
    <div class="h-full grid grid-cols-[11rem_1fr]">
      <div class="menu">
        <ul>
          <For each={Object.values(settingsMenuItems)}>
            {(item) => (
              <li>
                <a
                  class={`menu-item rounded-none -ml-2 ${
                    props.selectedMenu() === item ? 'active' : ''
                  }`}
                  onClick={() => {
                    props.setSelectedMenu(item);
                  }}
                >
                  {item}
                </a>
              </li>
            )}
          </For>
        </ul>
      </div>
      <div class="divider divider-horizontal -ml-1 -mr-2 -mt-3"></div>
    </div>
  );
};

const HeaderButtons = (props: SettingsMenuProps) => {
  return (
    <Switch fallback={<></>}>
      <Match when={props.selectedMenu() === settingsMenuItems.Locations}>
        <AddLocationButton />
      </Match>
      <Match when={props.selectedMenu() === settingsMenuItems.Assets}>
        <AddAssetButton />
      </Match>
      <Match when={props.selectedMenu() === settingsMenuItems.Accounts}>
        <AddAccountButton />
      </Match>
    </Switch>
  );
};

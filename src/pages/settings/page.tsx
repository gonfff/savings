import { ReloadProvider } from '@/components/contexts/reload';
import { AddLocationButton, LocationsPage } from '@/pages/settings/locations';

import { settingsMenuItems, SettingsMenuProps } from '@/types/settings';

import { createSignal, For, Match, Switch } from 'solid-js';
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
    <div class="h-24 flex flex-col">
      <div class="flex flex-row flex-1 items-center">
        <h1 class="flex-1 text-2xl font-bold text-left">Settings</h1>
        <HeaderButtons {...props} />
      </div>
      <div class="divider mt-1"></div>
    </div>
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
    </Switch>
  );
};

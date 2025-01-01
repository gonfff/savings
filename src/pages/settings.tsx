import { getThemeContext } from '@/components/contexts/theme';
import { DropdownInput, DropdownSelect } from '@/components/inputs';
import { SettingsCard } from '@/components/settings-card';
import { fetchDropdownSearchAssets } from '@/core/assets';
import {
  fetchBaseCurrency,
  saveBaseCurrencyButton,
  validateBaseCurrencyInput,
} from '@/core/base-currency';
import { saveThemeButton } from '@/core/themes';
import {
  inputDataTypes,
  InputProps,
  inputType,
  inputValue,
} from '@/types/inputs';
import { settingsMenuItems, SettingsMenuProps } from '@/types/settings';
import { availableThemes } from '@/types/themes';
import { createSignal, For, Match, onMount, Switch } from 'solid-js';
import { createStore } from 'solid-js/store';

const SettingsPage = () => {
  return (
    <div class="flex flex-col mr-3 mt-3 h-screen">
      <SettingsHeader />
      <SettingsContent />
    </div>
  );
};

export default SettingsPage;

const SettingsHeader = () => {
  return (
    <div class="h-24 flex flex-col">
      <div class="flex flex-row flex-1 items-center">
        <h1 class="flex-1 text-2xl font-bold text-left">Settings</h1>
      </div>
      <div class="divider mt-1"></div>
    </div>
  );
};

const SettingsContent = () => {
  const [selectedMenu, setSelectedMenu] = createSignal(
    settingsMenuItems.General,
  );

  return (
    <div class="h-screen w-full grid grid-cols-[12rem_1fr]">
      <SettingsMenu
        selectedMenu={selectedMenu}
        setSelectedMenu={setSelectedMenu}
      />
      <Switch fallback={<div>Settings not found</div>}>
        <Match when={selectedMenu() === settingsMenuItems.General}>
          <GeneralSettings />
        </Match>
        <Match when={selectedMenu() === settingsMenuItems.Locations}>
          <LocationsSettings />
        </Match>
        <Match when={selectedMenu() === settingsMenuItems.Appearance}>
          <AppearanceSettings />
        </Match>
      </Switch>
    </div>
  );
};

const SettingsMenu = (props: SettingsMenuProps) => {
  return (
    <div class="h-screen grid grid-cols-[11rem_1fr]">
      <div class="menu flex">
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

const GeneralSettings = () => {
  return (
    <div class="space-y-4">
      <BaseCurrencyCard />
    </div>
  );
};

const LocationsSettings = () => {
  return (
    <div class="space-y-4">
      <div class="bg-red-500">ХУЙХУЙХУЙ</div>
    </div>
  );
};

const AppearanceSettings = () => {
  return (
    <div class="space-y-4">
      <ThemeCard />
    </div>
  );
};
const BaseCurrencyCard = () => {
  const [baseCurrency, setBaseCurrency] = createStore<inputValue>({
    id: 0,
    value: '',
  });

  onMount(async () => {
    const currency = await fetchBaseCurrency();
    setBaseCurrency(currency);
  });

  const input = {
    input: {
      type: inputType.DropdownInput,
      key: 'base_currency',
      title: '',
      placeholder: 'Select your base currency',
      required: true,
      dataType: inputDataTypes.String,
      fetchFunction: fetchDropdownSearchAssets,
      value: baseCurrency,
      validationFunction: validateBaseCurrencyInput,
    },
    setter: setBaseCurrency,
  } as InputProps;

  return (
    <SettingsCard title="Base Currency" description="Select your base currency">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveBaseCurrencyButton(baseCurrency);
        }}
      >
        <DropdownInput {...input} />
        <div class="card-actions justify-end">
          <button class="btn btn-primary">Save</button>
        </div>
      </form>
    </SettingsCard>
  );
};

const ThemeCard = () => {
  const { theme, setTheme } = getThemeContext();

  const themeList = async () => {
    return Object.values(availableThemes).map((theme) => ({
      id: 1,
      value: theme,
    }));
  };

  return (
    <SettingsCard
      title="Theme"
      description="Select theme. You should press 'save' button for saving between
          sessions."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveThemeButton(theme());
        }}
      >
        <DropdownSelect
          input={{
            type: inputType.DropdownSelect,
            key: 'theme',
            title: '',
            placeholder: '',
            required: true,
            dataType: inputDataTypes.String,
            fetchFunction: themeList,
            value: { id: 1, value: theme() },
            validationFunction: () => true,
          }}
          setter={(value: inputValue) => setTheme(value.value.toString())}
        />
        <div class="card-actions justify-end">
          <button class="btn btn-primary">Save</button>
        </div>
      </form>
    </SettingsCard>
  );
};

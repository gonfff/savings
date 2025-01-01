import { getThemeContext } from '@/components/contexts/theme';
import { DropdownInput, DropdownSelect } from '@/components/inputs';
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
import { availableThemes } from '@/types/themes';
import { onMount } from 'solid-js';
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
  return (
    <div class="space-y-4">
      <BaseCurrencyCard />
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
    <div class="card w-full shadow-md border">
      <div class="card-body">
        <h2 class="card-title">Base currency</h2>
        <p class="text-sm opacity-50">Select your base currency</p>
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
      </div>
    </div>
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
    <div class="card w-full shadow-md border">
      <div class="card-body">
        <h2 class="card-title">Theme</h2>
        <p class="text-sm opacity-50">
          Select theme. You should press "save" button for saving between
          sessions.
        </p>
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
      </div>
    </div>
  );
};

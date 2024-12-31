import { DropdownInput } from '@/components/inputs';
import { fetchDropdownSearchAssets } from '@/core/assets';
import {
  fetchBaseCurrency,
  saveBaseCurrencyButton,
  validateBaseCurrencyInput,
} from '@/core/base-currency';
import {
  inputDataTypes,
  InputProps,
  inputType,
  inputValue,
} from '@/types/inputs';
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
    <>
      <BaseCurrencyCard />
    </>
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

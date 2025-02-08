import { DropdownInput } from '@/components/inputs';
import { SettingsCard } from '@/components/settings-card';
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

export const GeneralPage = () => {
  return (
    <div class="h-full space-y-4 overflow-y-auto">
      <BaseCurrencyCard />
      <div></div> {/* Add this div to beautify end */}
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

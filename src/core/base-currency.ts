import { inputValue } from '@/types/inputs';
import { ToastStyle } from '@/types/toasts';
import { invoke } from '@tauri-apps/api/core';
import { addToast } from './toasts';

export const fetchBaseCurrency = async (): Promise<inputValue> => {
  const resp = (await invoke('get_base_currency')) as inputValue;
  return resp;
};

const saveBaseCurrency = async (value: inputValue): Promise<void> => {
  console.log('Saving new base currency', value);
  await invoke('set_base_currency', { value });
};

export const saveBaseCurrencyButton = async (
  value: inputValue,
): Promise<void> => {
  try {
    await saveBaseCurrency(value);
  } catch (error) {
    console.error(error);
    addToast({
      title: 'Failed',
      description: 'Failed to save to the db',
      style: ToastStyle.Error,
    });
    return;
  }
  addToast({
    title: 'Saved',
    style: ToastStyle.Success,
  });
};

export const validateBaseCurrencyInput = (value: inputValue): boolean => {
  if (value.value === '' && value.id === 0) {
    return true;
  } else if (value.value && value.id === 0) {
    return false;
  }
  return true;
};

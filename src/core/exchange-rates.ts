import { addToast } from '@/core/toasts';
import { PaginatedResponse } from '@/types/base';
import { ExchangeRate, ExchangeRateRequest } from '@/types/exchange-rates';
import { inputValue } from '@/types/inputs';
import { ToastStyle } from '@/types/toasts';
import { invoke } from '@tauri-apps/api/core';

export const fetchExchangeRates = async (
  limit: number = 10,
  offset: number = 0,
): Promise<PaginatedResponse<ExchangeRate>> => {
  const resp = (await invoke('get_exchange_rates', {
    limit: limit,
    offset: offset,
  })) as PaginatedResponse<ExchangeRate>;
  resp.items = resp.items.map((item) => ({
    ...item,
    to_date: new Date(item.to_date),
  }));
  return resp;
};

export const addExchangeRate = async (
  rate: ExchangeRateRequest,
): Promise<null> => {
  console.log('Adding exchange rate', rate);
  await invoke<null>('add_exchange_rate', { rate });
  return null;
};

export const deleteExchangeRate = async (id: number): Promise<null> => {
  await invoke<null>('delete_exchange_rate', { id });
  return null;
};

export const updateExchangeRate = async (
  id: number,
  rate: ExchangeRateRequest,
): Promise<null> => {
  console.log('Updating exchange rate', id, rate);
  await invoke<null>('update_exchange_rate', { id, rate });
  return null;
};

export const addRateButtonAction = (
  setReload: (value: boolean) => void,
): ((formData: Record<string, inputValue>) => Promise<void>) => {
  return async (formData: Record<string, inputValue>) => {
    const exchangeRateRequest: ExchangeRateRequest = {
      from_id: formData.from_id.id,
      to_id: formData.to_id.id,
      rate: parseFloat(formData.rate.value as string),
      to_date: new Date(formData.to_date.value as string),
    };
    try {
      await addExchangeRate(exchangeRateRequest);
    } catch (error) {
      console.error(error);
      addToast({
        title: 'Failed',
        description: 'Failed to save to the db',
        style: ToastStyle.Error,
      });
      return;
    }
    setReload(true);
    addToast({
      title: 'Saved',
      style: ToastStyle.Success,
    });
  };
};

export const editRateButtonAction = (
  id: number,
  setReload: (value: boolean) => void,
): ((formData: Record<string, inputValue>) => Promise<void>) => {
  return async (formData: Record<string, inputValue>) => {
    const exchangeRateRequest: ExchangeRateRequest = {
      from_id: formData.from_id.id,
      to_id: formData.to_id.id,
      rate: parseFloat(formData.rate.value as string),
      to_date: new Date(formData.to_date.value as string),
    };
    try {
      await updateExchangeRate(id, exchangeRateRequest);
    } catch (error) {
      console.error(error);
      addToast({
        title: 'Failed',
        description: 'Failed to save to the db',
        style: ToastStyle.Error,
      });
      return;
    }
    setReload(true);
    addToast({
      title: 'Saved',
      style: ToastStyle.Success,
    });
  };
};

export const validateAssetInput = (value: inputValue): boolean => {
  if (value.value === '' && value.id === 0) {
    return true;
  } else if (value.value && value.id === 0) {
    return false;
  }
  return true;
};

export const validateRateInput = (value: inputValue): boolean => {
  if (typeof value.value === 'string' && parseFloat(value.value)) {
    return true;
  }
  if (typeof value.value === 'number' && !isNaN(value.value)) {
    return true;
  }
  return false;
};

import { addToast } from '@/core/toasts';
import { PaginatedResponse } from '@/types/base';
import { ExchangeRate, ExchangeRateRequest } from '@/types/exchange-rates';
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
  await invoke<null>('update_exchange_rate', { id, rate });
  return null;
};

export const addRateButtonAction = (
  setReload: (value: boolean) => void,
): ((formData: Record<string, string>) => Promise<void>) => {
  return async (formData: Record<string, string>) => {
    const exchangeRateRequest: ExchangeRateRequest = {
      from_id: parseInt(formData.from),
      to_id: parseInt(formData.to),
      rate: parseFloat(formData.rate),
      to_date: new Date(formData.date),
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
): ((formData: Record<string, string>) => Promise<void>) => {
  return async (formData: Record<string, string>) => {
    const exchangeRateRequest: ExchangeRateRequest = {
      from_id: parseInt(formData.from),
      to_id: parseInt(formData.to),
      rate: parseFloat(formData.rate),
      to_date: new Date(formData.date),
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

export const exchangeRateValidator = () => {};

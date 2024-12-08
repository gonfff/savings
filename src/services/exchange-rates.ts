import { invoke } from '@tauri-apps/api/core';

export interface ExchangeRate {
  id: number;
  source: string;
  target: string;
  rate: number;
  dt: Date;
}

export interface ExchangeRateResponse {
  items: ExchangeRate[];
  next: boolean;
}

export const fetchExchangeRates = async (
  limit: number = 10,
  offset: number = 0,
): Promise<ExchangeRateResponse> => {
  const resp = (await invoke('get_exchange_rates', {
    limit: limit,
    offset: offset,
  })) as ExchangeRateResponse;
  resp.items = resp.items.map((item) => ({
    ...item,
    dt: new Date(item.dt),
  }));
  return resp;
};

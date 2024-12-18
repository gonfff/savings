import { invoke } from '@tauri-apps/api/core';
import { PaginatedResponse } from './base.types';

export interface ExchangeRate {
  id: number;
  from_id: number;
  from_code: string;
  to_id: number;
  to_code: string;
  rate: number;
  source: string;
  to_date: Date;
}

export interface ExchangeRateRequest
  extends Omit<ExchangeRate, 'id' | 'from_code' | 'to_code' | 'source'> {}

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

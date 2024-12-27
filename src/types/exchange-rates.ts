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

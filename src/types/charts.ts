export interface Transaction {
  id: number;
  account_id: number;
  account_name: string;
  type: string;
  quantity: number;
  unit_price: number;
  description: string;
  date: Date;
}

export interface Chart {
  description: string;
  quantity: number;
  rate: number;
  growth: number;
  growth_percentage: number;
  items: Transaction[];
  next: boolean;
}

export enum PeriodEnum {
  Week = '1w',
  Month = '1m',
  Year = '1y',
  All = 'All',
}

export interface FetchChartProps {
  location_id: number | null;
  account_id: number | null;
  period: PeriodEnum;
}

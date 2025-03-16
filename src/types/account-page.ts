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

export interface AccountPageData {
  description: string;
  quantity: number;
  rate: number;
  growth: number;
  growth_percentage: number;
  items: Transaction[];
  next: boolean;
}

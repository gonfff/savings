export interface Location {
  id: number;
  name: string;
  description: string;
  created_at: Date;
}

export interface LocationRequest extends Omit<Location, 'id' | 'created_at'> {}

export interface LocationBalance extends Location {
  base_asset_name: string; // Base currency
  total_balance: number; // Total balance in base currency
}

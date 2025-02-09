export interface AccountMenuSelection {
  selectedLocation: () => number;
  selectedAccount: () => number;
  setSelectedLocation: (value: number) => void;
  setSelectedAccount: (value: number) => void;
}

export interface Account {
  id: number;
  location_id: number;
  location_name: string;
  asset_id: number;
  asset_name: string;
  asset_code: string;
  description: string;
  created_at: Date;
}

export interface CreateAccount
  extends Omit<
    Account,
    'id' | 'location_name' | 'asset_name' | 'asset_code' | 'created_at'
  > {}

export interface AccountsFilter {
  location_id: number | null;
  asset_id: number | null;
}

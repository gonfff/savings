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
  name: string;
  description: string;
  asset_name: string;
  asset_code: string;
  created_at: Date;
}

export interface CreateAccount
  extends Omit<
    Location,
    'id' | 'asset_name' | 'asset_code' | 'location_name' | 'created_at'
  > {}

export interface AccountsFilter {
  location_id: number | null;
  asset_id: number | null;
  name: string | null;
}

export interface Asset {
  id: number;
  code: string;
  type: string;
  name: string;
  created_at: Date;
}

export interface dropdownAsset {
  id: number;
  value: string;
  description: string;
}

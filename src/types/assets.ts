export interface Asset {
  id: number;
  code: string;
  type: string;
  name: string;
  created_at: Date;
}

export interface AssetRequest extends Omit<Asset, 'id' | 'created_at'> {}

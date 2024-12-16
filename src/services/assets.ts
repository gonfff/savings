import { invoke } from '@tauri-apps/api/core';

export interface Asset {
  id: number;
  code: string;
  type: string;
  name: string;
  created_at: Date;
}

export interface dropdownAsset {
  id: number;
  name: string;
  description: string;
}

export const fetchSearchAssets = async (
  query: string,
): Promise<dropdownAsset[]> => {
  const resp = (await invoke('search_assets', {
    query: query,
  })) as Asset[];

  return resp.map((item) => ({
    id: item.id,
    name: item.code,
    description: item.name,
  }));
};

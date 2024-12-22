import { Asset, dropdownAsset } from '@/types/assets';
import { invoke } from '@tauri-apps/api/core';

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

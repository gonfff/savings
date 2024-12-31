import { Asset, dropdownAsset } from '@/types/dropdown-response';
import { invoke } from '@tauri-apps/api/core';

export const fetchDropdownSearchAssets = async (
  query: string,
): Promise<dropdownAsset[]> => {
  const resp = (await invoke('search_assets', {
    query: query,
  })) as Asset[];

  return resp.map((item) => ({
    id: item.id,
    value: item.code,
    description: item.name,
  }));
};

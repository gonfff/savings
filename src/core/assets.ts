import { addToast } from '@/core/toasts';
import { Asset, AssetRequest } from '@/types/assets';
import { PaginatedResponse } from '@/types/base';
import { inputValue } from '@/types/inputs';
import { ToastStyle } from '@/types/toasts';
import { invoke } from '@tauri-apps/api/core';

export const fetchDropdownSearchAssets = async (
  query: string,
): Promise<inputValue[]> => {
  const resp = (await invoke('search_assets', {
    query: query,
  })) as Asset[];

  return resp.map((item) => ({
    id: item.id,
    value: item.code,
    description: item.name,
  }));
};

export const fetchAssets = async (
  limit: number = 10,
  offset: number = 0,
): Promise<PaginatedResponse<Asset>> => {
  const resp = (await invoke('get_assets', {
    limit: limit,
    offset: offset,
  })) as PaginatedResponse<Asset>;

  return resp;
};

export const addAsset = async (asset: AssetRequest): Promise<null> => {
  console.log('Adding asset', asset);
  await invoke<null>('add_asset', { asset });
  return null;
};

export const deleteAsset = async (id: number): Promise<null> => {
  await invoke<null>('delete_asset', { id });
  return null;
};

export const updateAsset = async (
  id: number,
  asset: AssetRequest,
): Promise<null> => {
  console.log('Updating asset', id, asset);
  await invoke<null>('update_asset', { id, asset });
  return null;
};

export const addAssetButtonAction = (
  setReload: (value: boolean) => void,
): ((formData: Record<string, inputValue>) => Promise<void>) => {
  return async (formData: Record<string, inputValue>) => {
    console.log('Add asset', formData);
    const AssetRequest: AssetRequest = {
      code: formData.description.value.toString(),
      type: formData.type.value.toString(),
      name: formData.name.value.toString(),
    };
    try {
      await addAsset(AssetRequest);
    } catch (error) {
      console.error(error);
      addToast({
        title: 'Failed',
        description: 'Failed to save to the db',
        style: ToastStyle.Error,
      });
      return;
    }
    setReload(true);
    addToast({
      title: 'Saved',
      style: ToastStyle.Success,
    });
  };
};

export const editAssetButtonAction = (
  id: number,
  setReload: (value: boolean) => void,
): ((formData: Record<string, inputValue>) => Promise<void>) => {
  return async (formData: Record<string, inputValue>) => {
    console.log('Edit asset', id, formData);

    const AssetRequest: AssetRequest = {
      code: formData.description.value.toString(),
      type: formData.type.value.toString(),
      name: formData.name.value.toString(),
    };

    try {
      await updateAsset(id, AssetRequest);
    } catch (error) {
      console.error(error);
      addToast({
        title: 'Failed',
        description: 'Failed to save to the db',
        style: ToastStyle.Error,
      });
      return;
    }
    setReload(true);
    addToast({
      title: 'Saved',
      style: ToastStyle.Success,
    });
  };
};

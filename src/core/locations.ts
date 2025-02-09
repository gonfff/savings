import { addToast } from '@/core/toasts';
import { PaginatedResponse } from '@/types/base';
import { inputValue } from '@/types/inputs';
import { Location, LocationRequest } from '@/types/locations';
import { ToastStyle } from '@/types/toasts';
import { invoke } from '@tauri-apps/api/core';

export const fetchLocations = async (
  limit: number = 10,
  offset: number = 0,
): Promise<PaginatedResponse<Location>> => {
  const resp = (await invoke('get_locations', {
    limit: limit,
    offset: offset,
  })) as PaginatedResponse<Location>;

  return resp;
};

export const addLocation = async (location: LocationRequest): Promise<null> => {
  console.log('Adding location', location);
  await invoke<null>('add_location', { location });
  return null;
};

export const deleteLocation = async (id: number): Promise<null> => {
  try {
    await invoke<null>('delete_location', { id });
    return null;
  } catch (error) {
    addToast({
      title: 'Failed',
      description: (error as Error).toString(),
      style: ToastStyle.Error,
    });
    return null;
  }
};

export const updateLocation = async (
  id: number,
  location: LocationRequest,
): Promise<null> => {
  console.log('Updating location', id, location);
  await invoke<null>('update_location', { id, location });
  return null;
};

export const addLocationButtonAction = (
  setReload: (value: boolean) => void,
): ((formData: Record<string, inputValue>) => Promise<void>) => {
  return async (formData: Record<string, inputValue>) => {
    const LocationRequest: LocationRequest = {
      name: formData.name.value.toString(),
      description: formData.description.value.toString(),
    };
    try {
      await addLocation(LocationRequest);
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

export const editLocationButtonAction = (
  id: number,
  setReload: (value: boolean) => void,
): ((formData: Record<string, inputValue>) => Promise<void>) => {
  return async (formData: Record<string, inputValue>) => {
    console.log('Edit location', id, formData);

    const LocationRequest: LocationRequest = {
      name: formData.name.value.toString(),
      description: formData.description.value.toString(),
    };

    try {
      await updateLocation(id, LocationRequest);
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

export const fetchDropdownSearchLocations = async (
  query: string,
): Promise<inputValue[]> => {
  const resp = (await invoke('search_locations', {
    query: query,
  })) as Location[];
  return resp.map((item) => ({
    id: item.id,
    value: item.name,
    description: item.description,
  }));
};

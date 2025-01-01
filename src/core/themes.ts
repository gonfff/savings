import { availableThemes } from '@/types/themes';
import { ToastStyle } from '@/types/toasts';
import { invoke } from '@tauri-apps/api/core';
import { addToast } from './toasts';

export const fetchTheme = async (): Promise<availableThemes> => {
  const resp = (await invoke('get_theme')) as availableThemes;
  console.log('Fetched theme', resp);
  return resp;
};

const saveTheme = async (value: string): Promise<void> => {
  console.log('Saving new theme', value);
  await invoke('set_theme', { value });
};

export const saveThemeButton = async (value: string): Promise<void> => {
  try {
    await saveTheme(value);
  } catch (error) {
    console.error(error);
    addToast({
      title: 'Failed',
      description: 'Failed to save to the db',
      style: ToastStyle.Error,
    });
    return;
  }
  console.log('Saved theme', value);
  addToast({
    title: 'Saved',
    style: ToastStyle.Success,
  });
};

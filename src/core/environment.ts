import { availableEnvs } from '@/types/environment';
import { invoke } from '@tauri-apps/api/core';

export const fetchEnv = async (): Promise<availableEnvs> => {
  const resp = (await invoke('get_env')) as availableEnvs;
  console.log('Fetched env', resp);
  return resp;
};

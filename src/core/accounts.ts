import { Account, AccountsFilter, CreateAccount } from '@/types/accounts';
import { PaginatedResponse } from '@/types/base';
import { invoke } from '@tauri-apps/api/core';

export const fetchAccounts = async (
  limit: number = 10,
  offset: number = 0,
): Promise<PaginatedResponse<Account>> => {
  const resp = (await invoke('get_accounts', {
    limit: limit,
    offset: offset,
  })) as PaginatedResponse<Account>;

  return resp;
};

export const addAccount = async (account: CreateAccount): Promise<null> => {
  console.log('Adding account', account);
  await invoke<null>('add_account', { account });
  return null;
};

export const deleteAccount = async (id: number): Promise<null> => {
  await invoke<null>('delete_account', { id });
  return null;
};

export const updateAccount = async (
  id: number,
  account: CreateAccount,
): Promise<null> => {
  console.log('Updating account', id, account);
  await invoke<null>('update_account', { id, account });
  return null;
};

export const fetchAccountsBy = async (
  filters: AccountsFilter,
  limit: number = 10,
  offset: number = 0,
): Promise<PaginatedResponse<Account>> => {
  const resp = (await invoke('get_accounts_by', {
    filters: filters,
    limit: limit,
    offset: offset,
  })) as PaginatedResponse<Account>;

  return resp;
};

// ----------------------------
// export const addAccountButtonAction = (
//   setReload: (value: boolean) => void,
// ): ((formData: Record<string, inputValue>) => Promise<void>) => {
//   return async (formData: Record<string, inputValue>) => {
//     const AccountRequest: CreateAccount = {
//       name: formData.name.value.toString(),
//       description: formData.description.value.toString(),
//     };
//     try {
//       await addAccount(AccountRequest);
//     } catch (error) {
//       console.error(error);
//       addToast({
//         title: 'Failed',
//         description: 'Failed to save to the db',
//         style: ToastStyle.Error,
//       });
//       return;
//     }
//     setReload(true);
//     addToast({
//       title: 'Saved',
//       style: ToastStyle.Success,
//     });
//   };
// };

// export const editAccountButtonAction = (
//   id: number,
//   setReload: (value: boolean) => void,
// ): ((formData: Record<string, inputValue>) => Promise<void>) => {
//   return async (formData: Record<string, inputValue>) => {
//     console.log('Edit account', id, formData);

//     const AccountRequest: AccountRequest = {
//       name: formData.name.value.toString(),
//       description: formData.description.value.toString(),
//     };

//     try {
//       await updateAccount(id, AccountRequest);
//     } catch (error) {
//       console.error(error);
//       addToast({
//         title: 'Failed',
//         description: 'Failed to save to the db',
//         style: ToastStyle.Error,
//       });
//       return;
//     }
//     setReload(true);
//     addToast({
//       title: 'Saved',
//       style: ToastStyle.Success,
//     });
//   };
// };

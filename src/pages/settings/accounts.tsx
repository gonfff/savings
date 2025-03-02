import { TableRowButton } from '@/components/buttons';
import {
  getModalContext,
  ModalProvider,
} from '@/components/contexts/modal-window';
import { getReloadContext } from '@/components/contexts/reload';
import { ModalWindow } from '@/components/modal-window';
import { PaginatedContainer } from '@/components/pagination';
import {
  addAccountButtonAction,
  deleteAccount,
  editAccountButtonAction,
  fetchAccounts,
  validateAccountInput,
} from '@/core/accounts';
import { fetchDropdownSearchAssets } from '@/core/assets';
import { validateAssetInput } from '@/core/exchange-rates';
import { fetchDropdownSearchLocations } from '@/core/locations';
import { Account } from '@/types/accounts';
import { Input, inputDataTypes, inputType } from '@/types/inputs';
import { createEffect, createSignal, For } from 'solid-js';

export const AccountsPage = () => {
  return (
    <div class="flex flex-col h-full overflow-hidden">
      <p class="text-sm opacity-50">
        The accounts table stores information about your accounts in current,
        for example BTC in Binance, USD in CityBank, and more.
      </p>
      <AccountsContent />
    </div>
  );
};

const AccountsContent = () => {
  return (
    <ModalProvider>
      <AccountsTable />
      <AccountsModal />
    </ModalProvider>
  );
};

const AccountsTable = () => {
  const [accounts, setAccounts] = createSignal<Account[] | null>(null);

  const limit = 20;
  const [offset, setOffset] = createSignal<number>(0);

  // event and effect for reloading the page after adding a new account
  const { reload, setReload } = getReloadContext();
  createEffect(() => {
    if (reload()) {
      setAccounts(null);
      setOffset(0);
      setReload(false);
    }
  });

  return (
    <PaginatedContainer
      limit={limit}
      offset={offset}
      setOffset={setOffset}
      items={accounts}
      setItems={setAccounts}
      fetchFunction={fetchAccounts}
    >
      <table class="table table-zebra">
        <thead class="sticky top-0 z-10 bg-base-100">
          <tr>
            <th>ID</th>
            <th>Location</th>
            <th>Asset</th>
            <th>Description</th>
            <th></th>
          </tr>
        </thead>
        <tbody class="h-full">
          <For each={accounts() ?? []} fallback={<></>}>
            {(account) => <AccountRow account={account} />}
          </For>
        </tbody>
      </table>
    </PaginatedContainer>
  );
};

const AccountRow = ({ account }: { account: Account }) => {
  const { setReload } = getReloadContext();
  const { isOpen, setIsOpen, setCurrentData } = getModalContext();

  return (
    <tr>
      <td>{account.id}</td>
      <td>{account.location_name}</td>
      <td>{account.asset_code}</td>
      <td>{account.description}</td>
      <td>
        <TableRowButton
          editFunc={() => {
            setCurrentData({
              inputs: accountsFormInputs(account),
              isOpen: isOpen,
              setIsOpen: setIsOpen,
              title: 'Edit Account',
              actionButton: editAccountButtonAction(account.id, setReload),
            });
            setIsOpen(true);
          }}
          deleteFunc={() => {
            deleteAccount(account.id);
            setReload(true);
          }}
        />
      </td>
    </tr>
  );
};

export const AccountsModal = () => {
  const { isOpen, setIsOpen, currentData } = getModalContext();

  return (
    <ModalWindow
      inputs={currentData.inputs}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={currentData.title}
      comment={currentData.comment}
      actionButton={currentData.actionButton}
    />
  );
};

export const AddAccountButton = () => {
  return (
    <ModalProvider>
      <_AddAccountButton />
      <AccountsModal />
    </ModalProvider>
  );
};

const _AddAccountButton = () => {
  const { isOpen, setIsOpen, setCurrentData } = getModalContext();
  const { setReload } = getReloadContext();

  return (
    <button
      class="btn btn-primary"
      onClick={() => {
        setCurrentData({
          inputs: accountsFormInputs(),
          isOpen: isOpen,
          setIsOpen: setIsOpen,
          title: 'Add Account',
          actionButton: addAccountButtonAction(setReload),
        });
        setIsOpen(true);
      }}
    >
      Add account
    </button>
  );
};

const accountsFormInputs = (account?: Account): Input[] => {
  return [
    {
      type: inputType.DropdownInput,
      key: 'location_id',
      title: 'Location',
      placeholder: 'Binance',
      required: true,
      dataType: inputDataTypes.String,
      fetchFunction: fetchDropdownSearchLocations,
      value: account
        ? { id: account.location_id, value: account.location_name }
        : { id: 0, value: '' },
      validationFunction: validateAccountInput,
    },
    {
      type: inputType.DropdownInput,
      key: 'asset_id',
      title: 'Aseet',
      placeholder: 'AAPL',
      required: true,
      dataType: inputDataTypes.String,
      fetchFunction: fetchDropdownSearchAssets,
      value: account
        ? { id: account.asset_id, value: account.asset_code }
        : { id: 0, value: '' },
      validationFunction: validateAssetInput,
    },
    {
      type: inputType.StringInput,
      key: 'name',
      title: 'Name',
      placeholder: 'Spot (Optional)',
      required: false,
      dataType: inputDataTypes.String,
      value: account ? { id: 0, value: account.name } : { id: 0, value: '' },
    },
    {
      type: inputType.StringInput,
      key: 'description',
      title: 'Description',
      placeholder: 'For new iPhone',
      required: false,
      dataType: inputDataTypes.String,
      value: account
        ? { id: 0, value: account.description }
        : { id: 0, value: '' },
    },
  ];
};

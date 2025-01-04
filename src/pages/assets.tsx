import { TableRowButton } from '@/components/buttons';
import { getModalContext } from '@/components/contexts/modal-window';
import { getReloadContext } from '@/components/contexts/reload';
import { ModalWindow } from '@/components/modal-window';
import { PaginatedContainer } from '@/components/pagination';
import {
  addAssetButtonAction,
  deleteAsset,
  editAssetButtonAction,
  fetchAssets,
} from '@/core/assets';
import { Asset } from '@/types/assets';
import { Input, inputDataTypes, inputType } from '@/types/inputs';
import { createEffect, createSignal, For } from 'solid-js';

export const AssetsContent = () => {
  return (
    <>
      <AssetsTable />
      <AssetsModal />
    </>
  );
};

const AssetsTable = () => {
  const [assets, setAssets] = createSignal<Asset[] | null>(null);

  const limit = 20;
  const [offset, setOffset] = createSignal<number>(0);

  // event and effect for reloading the page after adding a new asset
  const { reload, setReload } = getReloadContext();
  createEffect(() => {
    if (reload()) {
      setAssets(null);
      setOffset(0);
      setReload(false);
    }
  });

  return (
    <PaginatedContainer
      limit={limit}
      offset={offset}
      setOffset={setOffset}
      items={assets}
      setItems={setAssets}
      fetchFunction={fetchAssets}
    >
      <table class="table table-zebra">
        <thead class="sticky top-0 z-10 bg-base-100">
          <tr>
            <th>ID</th>
            <th>Code</th>
            <th>Type</th>
            <th>Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody class="h-full">
          <For each={assets() ?? []} fallback={<></>}>
            {(asset) => <AssetsRow asset={asset} />}
          </For>
        </tbody>
      </table>
    </PaginatedContainer>
  );
};

const AssetsRow = ({ asset }: { asset: Asset }) => {
  const { setReload } = getReloadContext();
  const { isOpen, setIsOpen, setCurrentData, clearCurrentData } =
    getModalContext();

  return (
    <tr>
      <td>{asset.id}</td>
      <td>{asset.code}</td>
      <td>{asset.type}</td>
      <td>{asset.name}</td>
      <td>
        <TableRowButton
          editFunc={() => {
            clearCurrentData();
            setCurrentData({
              inputs: assetsFormInputs(asset),
              isOpen: isOpen,
              setIsOpen: setIsOpen,
              title: 'Edit Asset',
              actionButton: editAssetButtonAction(asset.id, setReload),
            });
            setIsOpen(true);
          }}
          deleteFunc={() => {
            deleteAsset(asset.id);
            setReload(true);
          }}
        />
      </td>
    </tr>
  );
};

export const AssetsModal = () => {
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

export const AddAssetButton = () => {
  const { isOpen, setIsOpen, setCurrentData, clearCurrentData } =
    getModalContext();
  const { setReload } = getReloadContext();

  return (
    <button
      class="btn btn-primary"
      onClick={() => {
        clearCurrentData();
        setCurrentData({
          inputs: assetsFormInputs(),
          isOpen: isOpen,
          setIsOpen: setIsOpen,
          title: 'Add Asset',
          actionButton: addAssetButtonAction(setReload),
        });
        setIsOpen(true);
      }}
    >
      Add asset
    </button>
  );
};

const assetsFormInputs = (asset?: Asset): Input[] => {
  return [
    {
      type: inputType.StringInput,
      key: 'code',
      title: 'Code',
      placeholder: 'USDT',
      required: true,
      dataType: inputDataTypes.String,
      value: asset ? { id: 0, value: asset.code } : { id: 0, value: '' },
    },
    {
      type: inputType.StringInput,
      key: 'type',
      title: 'Type',
      placeholder: 'Crypto',
      required: true,
      dataType: inputDataTypes.String,
      value: asset ? { id: 0, value: asset.type } : { id: 0, value: '' },
    },
    {
      type: inputType.StringInput,
      key: 'name',
      title: 'Name',
      placeholder: 'Tether USD stablecoin',
      required: true,
      dataType: inputDataTypes.String,
      value: asset ? { id: 0, value: asset.name } : { id: 0, value: '' },
    },
  ];
};

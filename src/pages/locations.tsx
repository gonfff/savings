import { TableRowButton } from '@/components/buttons';
import { getModalContext } from '@/components/contexts/modal-window';
import { getReloadContext } from '@/components/contexts/reload';
import { ModalWindow } from '@/components/modal-window';
import { PaginatedContainer } from '@/components/pagination';
import {
  addLocationButtonAction,
  deleteLocation,
  editLocationButtonAction,
  fetchLocations,
} from '@/core/locations';
import { Input, inputDataTypes, inputType } from '@/types/inputs';
import { Location } from '@/types/locations';
import { createEffect, createSignal, For } from 'solid-js';

export const LocationsContent = () => {
  return (
    <>
      <LocationsTable />
      <LocationsModal />
    </>
  );
};

const LocationsTable = () => {
  const [locations, setLocations] = createSignal<Location[] | null>(null);

  const limit = 20;
  const [offset, setOffset] = createSignal<number>(0);

  // event and effect for reloading the page after adding a new location
  const { reload, setReload } = getReloadContext();
  createEffect(() => {
    if (reload()) {
      setLocations(null);
      setOffset(0);
      setReload(false);
    }
  });

  return (
    <PaginatedContainer
      limit={limit}
      offset={offset}
      setOffset={setOffset}
      items={locations}
      setItems={setLocations}
      fetchFunction={fetchLocations}
    >
      <table class="table table-zebra">
        <thead class="sticky top-0 z-10 bg-base-100">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th></th>
          </tr>
        </thead>
        <tbody class="h-full">
          <For each={locations() ?? []} fallback={<></>}>
            {(location) => <LocationsRow location={location} />}
          </For>
        </tbody>
      </table>
    </PaginatedContainer>
  );
};

const LocationsRow = ({ location }: { location: Location }) => {
  const { setReload } = getReloadContext();
  const { isOpen, setIsOpen, setCurrentData } = getModalContext();

  return (
    <tr>
      <td>{location.id}</td>
      <td>{location.name}</td>
      <td>{location.description}</td>
      <td>
        <TableRowButton
          editFunc={() => {
            setCurrentData({
              inputs: locationsFormInputs(location),
              isOpen: isOpen,
              setIsOpen: setIsOpen,
              title: 'Edit Exchange Location',
              comment: 'Dont forget to add assets first',
              actionButton: editLocationButtonAction(location.id, setReload),
            });
            setIsOpen(true);
          }}
          deleteFunc={() => {
            deleteLocation(location.id);
            setReload(true);
          }}
        />
      </td>
    </tr>
  );
};

export const LocationsModal = () => {
  const { isOpen, setIsOpen, currentData } = getModalContext();
  console.log(currentData);
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

export const AddLocationButton = () => {
  const { isOpen, setIsOpen, setCurrentData } = getModalContext();
  const { setReload } = getReloadContext();

  return (
    <button
      class="btn btn-primary"
      onClick={() => {
        setCurrentData({
          inputs: locationsFormInputs(),
          isOpen: isOpen,
          setIsOpen: setIsOpen,
          title: 'Add Exchange Location',
          comment: 'Dont forget to add assets first',
          actionButton: addLocationButtonAction(setReload),
        });
        setIsOpen(true);
      }}
    >
      Add location
    </button>
  );
};

const locationsFormInputs = (location?: Location): Input[] => {
  return [
    {
      type: inputType.StringInput,
      key: 'name',
      title: 'Name',
      placeholder: 'Ziraat bankasi',
      required: true,
      dataType: inputDataTypes.String,
      value: location ? { id: 0, value: location.name } : { id: 0, value: '' },
    },
    {
      type: inputType.StringInput,
      key: 'description',
      title: 'Description',
      placeholder: 'My turkish bank',
      required: true,
      dataType: inputDataTypes.String,
      value: location
        ? { id: 0, value: location.description }
        : { id: 0, value: '' },
    },
  ];
};

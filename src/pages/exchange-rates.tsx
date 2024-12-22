import { TableRowButton } from '@/components/buttons';
import {
  getModalContext,
  ModalProvider,
} from '@/components/contexts/modal-window';
import { getReloadContext, ReloadProvider } from '@/components/contexts/reload';
import { ModalWindow } from '@/components/modal-window';
import { PaginatedContainer } from '@/components/pagination';
import { fetchSearchAssets } from '@/core/assets';
import {
  addRateButtonAction,
  deleteExchangeRate,
  editRateButtonAction,
  fetchExchangeRates,
} from '@/core/exchange-rates';
import { ExchangeRate } from '@/types/exchange-rates';
import { Input } from '@/types/modal-window';
import { createEffect, createSignal, For } from 'solid-js';

const ExchangeRatesPage = () => {
  return (
    <div class="flex flex-col mr-3 mt-3 h-screen">
      <ReloadProvider>
        <ModalProvider>
          <ExchangeRatesHeader />
          <ExchangeRatesTable />
          <ExchangeRateModal />
        </ModalProvider>
      </ReloadProvider>
    </div>
  );
};

export default ExchangeRatesPage;

const ExchangeRatesHeader = () => {
  return (
    <div class="h-20 flex flex-col">
      <div class="flex flex-row flex-1 items-center">
        <h1 class="flex-1 text-2xl font-bold text-left">Exchange Rates</h1>
        <AddRateButton />
      </div>
      <div class="divider"></div>
    </div>
  );
};

const ExchangeRatesTable = () => {
  const [rates, setRates] = createSignal<ExchangeRate[] | null>(null);

  const limit = 20;
  const [offset, setOffset] = createSignal<number>(0);

  // event and effect for reloading the page after adding a new rate
  const { reload, setReload } = getReloadContext();
  createEffect(() => {
    if (reload()) {
      setRates(null);
      setOffset(0);
      setReload(false);
    }
  });

  return (
    <PaginatedContainer
      limit={limit}
      offset={offset}
      setOffset={setOffset}
      items={rates}
      setItems={setRates}
      fetchFunction={fetchExchangeRates}
    >
      <table class="table table-zebra">
        <thead class="sticky top-0 z-10 bg-base-100">
          <tr>
            <th>Date</th>
            <th>From</th>
            <th>To</th>
            <th>Rate</th>
            <th>Source</th>
            <th></th>
          </tr>
        </thead>
        <tbody class="h-full">
          <For each={rates() ?? []} fallback={<></>}>
            {(rate) => <ExchangeRatesRow rate={rate} />}
          </For>
        </tbody>
      </table>
    </PaginatedContainer>
  );
};

const ExchangeRatesRow = ({ rate }: { rate: ExchangeRate }) => {
  const { setReload } = getReloadContext();
  const { isOpen, setIsOpen, setCurrentData } = getModalContext();

  return (
    <tr>
      <td>{rate.to_date.toLocaleDateString()}</td>
      <td>{rate.from_code}</td>
      <td>{rate.to_code}</td>
      <td>{rate.rate}</td>
      <td>{rate.source}</td>
      <td>
        <TableRowButton
          editFunc={() => {
            setCurrentData({
              formInputs: exchangeRatesFormInputs(rate),
              isOpen: isOpen,
              setIsOpen: setIsOpen,
              title: 'Edit Exchange Rate',
              comment: 'Dont forget to add assets first',
              actionButton: editRateButtonAction(rate.id, setReload),
            });
            setIsOpen(true);
          }}
          deleteFunc={() => {
            deleteExchangeRate(rate.id);
            setReload(true);
          }}
        />
      </td>
    </tr>
  );
};

const ExchangeRateModal = () => {
  const { isOpen, setIsOpen, currentData } = getModalContext();

  return (
    <ModalWindow
      formInputs={currentData().formInputs}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={currentData().title}
      comment={currentData().comment}
      actionButton={currentData().actionButton}
    />
  );
};

const AddRateButton = () => {
  const { isOpen, setIsOpen, setCurrentData } = getModalContext();
  const { setReload } = getReloadContext();

  return (
    <button
      class="btn btn-primary"
      onClick={() => {
        setCurrentData({
          formInputs: exchangeRatesFormInputs(),
          isOpen: isOpen,
          setIsOpen: setIsOpen,
          title: 'Add Exchange Rate',
          comment: 'Dont forget to add assets first',
          actionButton: addRateButtonAction(setReload),
        });
        setIsOpen(true);
      }}
    >
      Add rate
    </button>
  );
};

const exchangeRatesFormInputs = (rate?: ExchangeRate): Input[] => {
  return [
    {
      input: {
        name: 'from',
        type: 'text',
        placeholder: 'AAPL',
        required: true,
        fetchFunction: fetchSearchAssets,
        item: rate ? { id: rate.from_id, name: rate.from_code } : undefined,
      },
      inputType: 'DropdownInput',
      key: 'from_id',
    },
    {
      input: {
        name: 'to',
        type: 'text',
        placeholder: 'USD',
        required: true,
        fetchFunction: fetchSearchAssets,
        item: rate ? { id: rate.to_id, name: rate.to_code } : undefined,
      },
      inputType: 'DropdownInput',
      key: 'to_id',
    },
    {
      input: {
        name: 'rate',
        type: 'float',
        placeholder: '3.123',
        required: true,
        value: rate ? rate.rate.toString() : undefined,
      },
      inputType: 'StringInput',
      key: 'rate',
    },
    {
      input: {
        name: 'date',
        type: 'date',
        value: rate
          ? new Date(rate.to_date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
      },
      inputType: 'StringInput',
      key: 'to_date',
    },
  ];
};

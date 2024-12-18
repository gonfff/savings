import { createEffect, createSignal, For } from 'solid-js';
import { AddRateButton, TableRowButton } from '../components/buttons.tsx';
import {
  getReloadContext,
  ReloadProvider,
} from '../components/contexts/reload.tsx';
import { formInputType, ModalWindow } from '../components/modal-window.tsx';
import { PaginatedContainer } from '../components/pagination.tsx';
import { fetchSearchAssets } from '../services/assets.ts';
import {
  addExchangeRate,
  ExchangeRate,
  ExchangeRateRequest,
  fetchExchangeRates,
} from '../services/exchange-rates.ts';

const ExchangeRatesPage = () => {
  return (
    <div class="flex flex-col mr-3 mt-3 h-screen">
      <ReloadProvider>
        <ExchangeRatesHeader />
        <ExchangeRatesTable />
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
        <AddRate />
      </div>
      <div class="divider"></div>
    </div>
  );
};

const AddRate = () => {
  const [isOpen, setIsOpen] = createSignal(false);

  // Get setter for reload signal from context
  const { setReload } = getReloadContext();

  const items: formInputType[] = [
    {
      inputType: 'DropdownInput',
      name: 'from',
      type: 'text',
      placeholder: 'AAPL',
      required: true,
      fetchFunction: fetchSearchAssets,
    },
    {
      inputType: 'DropdownInput',
      name: 'to',
      type: 'text',
      placeholder: 'USD',
      required: true,
      fetchFunction: fetchSearchAssets,
    },
    {
      inputType: 'FormInput',
      name: 'rate',
      type: 'float',
      placeholder: '3.123',
      required: true,
    },
    {
      inputType: 'FormInput',
      name: 'date',
      type: 'date',
      value: new Date().toISOString().split('T')[0],
    },
  ];
  return (
    <>
      <AddRateButton title="Add Rate" setIsOpen={setIsOpen} />
      <ModalWindow
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        formInputs={items}
        title="Add Exchange Rate"
        comment="Dont forget to add assets first"
        buttonAction={async (formData) => {
          const exchangeRateRequest: ExchangeRateRequest = {
            from_id: parseInt(formData.from),
            to_id: parseInt(formData.to),
            rate: parseFloat(formData.rate),
            to_date: new Date(formData.date),
          };
          await addExchangeRate(exchangeRateRequest);
          setReload(true);
        }}
      />
    </>
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
        <tbody>
          <For each={rates() ?? []} fallback={<></>}>
            {(rate) => <ExchangeRatesRow rate={rate} />}
          </For>
        </tbody>
      </table>
    </PaginatedContainer>
  );
};

const ExchangeRatesRow = ({ rate }: { rate: ExchangeRate }) => {
  return (
    <tr>
      <td>{rate.to_date.toLocaleDateString()}</td>
      <td>{rate.from_code}</td>
      <td>{rate.to_code}</td>
      <td>{rate.rate}</td>
      <td>{rate.source}</td>
      <td>
        <TableRowButton />
      </td>
    </tr>
  );
};

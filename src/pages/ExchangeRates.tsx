import { createEffect, createSignal, For, onCleanup, onMount } from 'solid-js';
import { TableRowButton } from '../components/buttons.tsx';
import { FormInput } from '../components/FormInput.tsx';
import useForm from '../hooks/UseForm.ts';
import {
  ExchangeRate,
  fetchExchangeRates,
} from '../services/exchange-rates.ts';

const ExchangeRatesPage = () => {
  return (
    <div class="flex flex-col mr-3 mt-3 h-screen">
      <ExchangeRatesHeader />
      <ExchangeRatesTable />
    </div>
  );
};

export default ExchangeRatesPage;

const ExchangeRatesHeader = () => {
  return (
    <div class="h-20 flex flex-col">
      <div class="flex flex-row flex-1 items-center">
        <h1 class="flex-1 text-2xl font-bold text-left">Exchange Rates</h1>
        <AddRateForm />
      </div>
      <div class="divider"></div>
    </div>
  );
};

type ModalTextProps = {
  text: string;
};

const ModalTitle = (props: ModalTextProps) => {
  return <h3 class="font-bold text-lg">{props.text}</h3>;
};

const ModalText = (props: ModalTextProps) => {
  return <p class="text-sm opacity-50">{props.text}</p>;
};

const AddRateForm = () => {
  const [isOpen, setIsOpen] = createSignal(false);

  // let formConstructor = [
  //   {
  //     name: 'source',
  //     placeholder: 'AAPL',
  //     type: 'text',
  //     setFormData,
  //     value: 'QWERT',
  //   },
  //   {
  //     name: 'target',
  //     placeholder: 'USD',
  //     type: 'text',
  //     setFormData,
  //     value: 'RUB',
  //   },
  //   {
  //     name: 'rate',
  //     placeholder: '3.123',
  //     type: 'float',
  //     setFormData,
  //     value: '1',
  //   },
  //   {
  //     name: 'date',
  //     type: 'text',
  //     setFormData,
  //     value: '20-12-2024',
  //   },
  // ];
  const formConstructor = [
    {
      name: 'source',
      placeholder: 'AAPL',
      type: 'text',
      value: 'QWERT',
    },
    {
      name: 'target',
      placeholder: 'USD',
      type: 'text',
      value: 'RUB',
    },
    {
      name: 'rate',
      placeholder: '3.123',
      type: 'float',
      value: '1',
    },
    {
      name: 'date',
      type: 'date',
      value: '2024-12-20',
    },
  ];

  const formData = formConstructor.reduce(
    (acc, cur) => ({ ...acc, [cur.name]: cur.value }),
    {},
  );

  const { form, updateFormField, submit, setDefaultValues, clearField } =
    useForm(formData);

  const handleSubmit = (event: Event): void => {
    event.preventDefault();
    setIsOpen(false);
    submit(form);
    setDefaultValues();
  };

  createEffect(() => {
    if (form.sameAsAddress) {
      clearField('shippingAddress');
    }
  });

  return (
    <>
      <button class="btn btn-primary" onClick={() => setIsOpen(true)}>
        Add Rate
      </button>

      {isOpen() && (
        <div
          class="modal modal-open"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <form onSubmit={handleSubmit}>
            <div class="modal-box">
              <ModalTitle text="Add Exchange Rate" />
              <ModalText text="Dont forget to add assets first" />
              {
                <>
                  {formConstructor.map((item) => {
                    return (
                      <FormInput
                        name={item.name}
                        type={item.type}
                        placeholder={item.placeholder}
                        value={form[item.name]}
                        updateFormField={updateFormField}
                      />
                    );
                  })}
                </>
              }
              <div class="modal-action">
                <button class="form-submit btn btn-primary" type="submit">
                  Save
                </button>
                <button class="btn" onClick={() => {}}>
                  Close
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );

  // return (
  //   <ModalWindow
  //     title="Add Exchange Rate"
  //     text="Dont forget to add assets first"
  //     triggerButton={<button class="btn btn-primary">Add Rate</button>}
  //     actionButtonCallback={handleSave}
  //   >
  //     {(setFormData) => (
  //       <>
  //         <FormInput
  //           name="source"
  //           placeholder="AAPL"
  //           type="text"
  //           setFormData={setFormData}
  //         />
  //         <FormInput
  //           name="target"
  //           placeholder="USD"
  //           type="text"
  //           setFormData={setFormData}
  //         />
  //         <FormInput
  //           name="rate"
  //           placeholder="3.123"
  //           type="number"
  //           setFormData={setFormData}
  //         />
  //         <FormInput name="date" type="date" setFormData={setFormData} />
  //       </>
  //     )}
  //   </ModalWindow>
  // );
};

const ExchangeRatesTable = () => {
  let tableContainer: HTMLDivElement | undefined;

  // init pagination signals
  const [rates, setRates] = createSignal<ExchangeRate[] | null>(null);
  const [nextPage, setNextPage] = createSignal<boolean>(false);
  const [limit] = createSignal<number>(20);
  const [offset, setOffset] = createSignal<number>(0);

  // fetch next data and put it in the rates signal
  const fetchNextData = async () => {
    if (nextPage()) {
      setOffset(offset() + limit());
      const data = await fetchExchangeRates(limit(), offset());
      setRates([...(rates() || []), ...data.items]);
    }
  };

  // fetch next data when user scrolls to the bottom of the table
  const handleScroll = () => {
    if (
      tableContainer &&
      tableContainer.scrollTop + tableContainer.clientHeight >=
        tableContainer.scrollHeight
    ) {
      fetchNextData();
    }
  };

  // add scroll event listener to the table container
  createEffect(() => {
    if (tableContainer) {
      tableContainer.addEventListener('scroll', handleScroll);
      onCleanup(() => {
        tableContainer.removeEventListener('scroll', handleScroll);
      });
    }
  });

  // fetch data on mount
  onMount(async () => {
    const data = await fetchExchangeRates(limit(), offset());
    setRates(data.items);
    setNextPage(data.next);
  });

  return (
    <div ref={tableContainer} class="overflow-y-auto">
      <table class="table table-zebra">
        <thead class="sticky top-0 z-10 bg-base-100">
          <tr>
            {/* <th>ID</th> */}
            <th>Date</th>
            <th>Source</th>
            <th>Target</th>
            <th>Rate</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <For each={rates() ?? []} fallback={<></>}>
            {(rate) => <ExchangeRatesRow rate={rate} />}
          </For>
        </tbody>
      </table>
    </div>
  );
};

const ExchangeRatesRow = ({ rate }: { rate: ExchangeRate }) => {
  return (
    <tr>
      <td>{rate.dt.toLocaleDateString()}</td>
      <td>{rate.source}</td>
      <td>{rate.target}</td>
      <td>{rate.rate}</td>
      <td>
        <TableRowButton />
      </td>
    </tr>
  );
};

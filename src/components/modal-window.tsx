import { DropdownInput, FormInput } from '@/components/inputs';
import { DropdownInputProps } from '@/types/inputs';
import { ModalTextProps, ModalWindowProps } from '@/types/modal-window';
import { For, Match, Switch } from 'solid-js';
import { createStore } from 'solid-js/store';

export const ModalWindow = (props: ModalWindowProps) => {
  const [customInputData, setCustomInputData] = createStore<
    Record<string, string>
  >({});

  return (
    <>
      {props.isOpen() && (
        <div
          class="modal modal-open"
          onClick={(e) => {
            if (e.target === e.currentTarget) props.setIsOpen(false);
          }}
        >
          <div class="modal-box h-max">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                // get value of all form inputs
                const formData = new FormData(event.currentTarget);
                const data: Record<string, string> = {};

                // set defaults
                props.formInputs.map((item) => {
                  switch (item.inputType) {
                    case 'DropdownInput': {
                      const input = item.input as DropdownInputProps;
                      setCustomInputData(
                        input.name,
                        customInputData[input.name] ||
                          input.item?.id.toString() ||
                          '',
                      );
                      break;
                    }
                  }
                });
                console.log(data);

                formData.forEach((value, key) => {
                  data[key] = value.toString();
                });

                // set custom input data e.g. id from dropdown
                Object.entries(customInputData).map(
                  ([key, value]) => (data[key] = value as string),
                );

                console.log(data);

                props.actionButton(data);
                props.setIsOpen(false);
              }}
            >
              <ModalTitle text={props.title} />
              <ModalComment text={props.comment || ''} />
              <div class="form-control">
                <For each={props.formInputs ?? []} fallback={<></>}>
                  {(item) => (
                    <Switch fallback={<div>Not Found</div>}>
                      <Match when={item.inputType === 'StringInput'}>
                        <FormInput {...item.input} />
                      </Match>
                      <Match when={item.inputType === 'DropdownInput'}>
                        <DropdownInput
                          {...item.input}
                          setCustomInputData={setCustomInputData}
                        />
                      </Match>
                    </Switch>
                  )}
                </For>
              </div>
              <div class="modal-action">
                <button class="form-submit btn btn-primary" type="submit">
                  Save
                </button>
                <button
                  class="btn"
                  onClick={() => {
                    props.setIsOpen(false);
                  }}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export const ModalTitle = (props: ModalTextProps) => {
  return <h3 class="font-bold text-lg">{props.text}</h3>;
};

export const ModalComment = (props: ModalTextProps) => {
  return <p class="text-sm opacity-50">{props.text}</p>;
};

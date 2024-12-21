import { For } from 'solid-js';
import { createStore } from 'solid-js/store';
import { DropdownInput, DropdownInputProps, FormInput } from './inputs';

export interface formInputType extends DropdownInputProps {
  inputType: string;
}
interface ModalWindowProps {
  formInputs: formInputType[];
  isOpen: () => boolean; // Modal window open state
  setIsOpen: (state: boolean) => void; // Modal window open state event handler
  title: string; // Modal window title
  comment?: string; // Modal window description
  buttonAction: (formData: Record<string, string>) => void; // Callback function for action button
}

type ModalTextProps = {
  text: string;
};

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
              onSubmit={(e) => {
                e.preventDefault();
                // get value of all form inputs
                const formData = new FormData(e.currentTarget);
                const data: Record<string, string> = {};
                formData.forEach((value, key) => {
                  data[key] = value.toString();
                });
                // set custom input data e.g. id from dropdown
                Object.entries(customInputData).map(
                  ([key, value]) => (data[key] = value as string),
                );

                props.buttonAction(data);
                props.setIsOpen(false);
              }}
            >
              <ModalTitle text={props.title} />
              <ModalComment text={props.comment || ''} />
              {
                <div class="form-control">
                  {/* render form inputs here to prevent saving input data */}
                  <For each={props.formInputs ?? []} fallback={<></>}>
                    {(item) =>
                      item.inputType === 'FormInput' ? (
                        <FormInput
                          name={item.name}
                          type={item.type}
                          placeholder={item.placeholder}
                          value={item.value}
                          required={item.required}
                        />
                      ) : item.inputType === 'DropdownInput' ? (
                        <DropdownInput
                          name={item.name}
                          type={item.type}
                          placeholder={item.placeholder}
                          value={item.value}
                          required={item.required}
                          fetchFunction={item.fetchFunction}
                          setCustomInputData={setCustomInputData}
                        />
                      ) : null
                    }
                  </For>
                </div>
              }
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

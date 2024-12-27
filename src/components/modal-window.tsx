import { Input, inputType, inputValue } from '@/types/inputs';
import { ModalTextProps, ModalWindowProps } from '@/types/modal-window';
import { createEffect, For, Match, Switch } from 'solid-js';
import { createStore } from 'solid-js/store';
import { DropdownInput, FormInput } from './inputs';

export const ModalWindow = (props: ModalWindowProps) => {
  const [inputs, setInputs] = createStore<Record<string, Input>>();
  createEffect(() => {
    props.inputs.forEach((input) => {
      setInputs(input.key, input);
    });
  });

  const setter = (key: string) => {
    return (value: inputValue) => {
      setInputs(key, 'value', value);
    };
  };

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
                const data: Record<string, inputValue> = {};

                if (inputs) {
                  Object.entries(inputs).forEach(([key, value]) => {
                    data[key] = value.value;
                  });
                }
                props.actionButton(data);
                props.setIsOpen(false);
              }}
            >
              <ModalTitle text={props.title} />
              <ModalComment text={props.comment || ''} />
              <div class="form-control">
                <For each={Object.keys(inputs) ?? []} fallback={<></>}>
                  {(key) => (
                    <Switch fallback={<div>Not Found</div>}>
                      <Match when={inputs[key].type === inputType.StringInput}>
                        <FormInput input={inputs[key]} setter={setter(key)} />
                      </Match>
                      <Match
                        when={inputs[key].type === inputType.DropdownInput}
                      >
                        <DropdownInput
                          input={inputs[key]}
                          setter={setter(key)}
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

import { InputProps, inputValue } from '@/types/inputs';
import { createEffect, createSignal, For } from 'solid-js';

export const FormInput = (props: InputProps) => {
  const [error, setError] = createSignal<boolean>(false);

  createEffect(() => {
    if (props.input.value.value === '') {
      setError(false);
    } else if (props.input.validationFunction) {
      setError(!props.input.validationFunction(props.input.value));
    } else {
      setError(false);
    }
  });

  return (
    <label class="block py-3 block font-medium text-sm">
      {props.input.title}
      <input
        class={`placeholder:italic w-full border py-2 pl-2 h-10
               shadow-sm focus:outline-none focus:border-primary focus:ring-primary focus:ring-1 no-arrows
               ${error() ? 'border-red-500' : ''}`}
        value={props.input.value.value || ''}
        placeholder={props.input.placeholder || ''}
        type={props.input.dataType || 'string'}
        name={props.input.key}
        required={props.input.required}
        step="any"
        onInput={(event) => {
          if (!event.currentTarget.validity.valid) {
            setError(true);
          }
          props.setter({ id: 0, value: event.currentTarget.value });
        }}
      />
    </label>
  );
};

export const DropdownInput = (props: InputProps) => {
  const [fetchedItems, setFetchedItems] = createSignal<inputValue[]>([]);
  const [showDropdown, setShowDropdown] = createSignal<boolean>(false);
  const [error, setError] = createSignal<boolean>(false);

  createEffect(() => {
    if (props.input.validationFunction) {
      setError(!props.input.validationFunction(props.input.value));
    } else {
      setError(false);
    }
  });

  const fetchResults = async (query: string) => {
    if (!props.input.fetchFunction) {
      return;
    }

    const data = await props.input.fetchFunction(query);
    if (data.length === 0) {
      data.push({ id: 0, value: 'No results found', description: '' });
    }
    setFetchedItems(data);
    setShowDropdown(data.length > 0);
  };

  createEffect(() => {
    const q = props.input.value?.value.toString() || '';

    if (q.length >= 1 && props.input.value!.id === 0) {
      fetchResults(q);
    } else {
      setFetchedItems([]);
      setShowDropdown(false);
    }
  });

  return (
    <label class="block py-3 block font-medium text-sm relative dropdown">
      {props.input.title}
      <input
        class={`placeholder:italic w-full border py-2 pl-2 h-10
          shadow-sm focus:outline-none focus:border-primary focus:ring-primary focus:ring-1
          ${error() ? 'border-red-500' : ''}`}
        value={props.input.value?.value || ''}
        placeholder={props.input.placeholder || ''}
        type={props.input.dataType || 'string'}
        step="any"
        name={props.input.key}
        required={props.input.required}
        onInput={(e) => {
          props.setter({ id: 0, value: e.currentTarget.value });
        }}
        onFocus={() => setShowDropdown(fetchedItems().length > 0)}
        tabIndex={0}
        onBlur={() => setShowDropdown(false)}
      />
      {showDropdown() && (
        <ul class="absolute z-10 bg-base-100 border menu w-full mt-1 shadow-lg cursor-pointer overflow-x-hidden overflow-y-auto">
          <For each={fetchedItems() ?? []} fallback={<></>}>
            {(item) => (
              <li>
                <a
                  class="menu-item p-1 rounded-none"
                  disabled={item.id === 0} // disable 'No results found' item
                  onMouseDown={(e) => e.preventDefault()} // Prevent blur
                  onClick={() => {
                    props.setter({ id: item.id, value: item.value });
                    setShowDropdown(false);
                  }}
                >
                  {item.description
                    ? `${item.value}, ${item.description}`
                    : item.value}
                </a>
              </li>
            )}
          </For>
        </ul>
      )}
    </label>
  );
};

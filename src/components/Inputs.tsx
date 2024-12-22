import { DropdownInputProps, StringInputProps } from '@/types/inputs';
import { queryItem } from '@/types/modal-window';
import { createEffect, createSignal, For } from 'solid-js';

export const FormInput = (props: StringInputProps) => {
  return (
    <label class="block py-3 block font-medium text-sm">
      {props.name.charAt(0).toUpperCase() + props.name.slice(1)}
      <input
        class="placeholder:italic w-full border py-2 pl-2 h-10
               shadow-sm focus:outline-none focus:border-primary focus:ring-primary focus:ring-1 no-arrows"
        value={props.value || ''}
        placeholder={props.placeholder || ''}
        type={props.type}
        name={props.name}
        required={props.required}
      />
    </label>
  );
};

export const DropdownInput = (props: DropdownInputProps) => {
  const [query, setQuery] = createSignal<queryItem>(
    props.item ? props.item : { id: 0, name: '' },
  );
  const [fetchedItems, setFetchedItems] = createSignal<queryItem[]>([]);
  const [showDropdown, setShowDropdown] = createSignal<boolean>(false);

  const fetchResults = async (query: string) => {
    const data = props.fetchFunction
      ? ((await props.fetchFunction(query)) as queryItem[])
      : [];
    if (data.length === 0) {
      data.push({ id: 0, name: 'No results found', description: '' });
    }
    setFetchedItems(data);
    setShowDropdown(data.length > 0);
  };

  createEffect(() => {
    const q = query().name.trim();
    if (q.length >= 1 && !query().id) {
      fetchResults(q);
    } else {
      setFetchedItems([]);
      setShowDropdown(false);
    }
  });

  return (
    <label class="block py-3 block font-medium text-sm relative dropdown">
      {props.name.charAt(0).toUpperCase() + props.name.slice(1)}
      <input
        name={props.name}
        type={props.type}
        value={query().name}
        placeholder={props.placeholder || ''}
        class="placeholder:italic w-full border py-2 pl-2 h-10
               shadow-sm focus:outline-none focus:border-primary focus:ring-primary focus:ring-1"
        onInput={(e) => {
          setQuery({ id: 0, name: e.currentTarget.value });
          props.setCustomInputData && props.setCustomInputData(props.name, '');
        }}
        onFocus={() => setShowDropdown(fetchedItems().length > 0)}
        required={props.required}
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
                    setQuery({ id: item.id, name: item.name });
                    props.setCustomInputData &&
                      props.setCustomInputData(props.name, item.id.toString());
                    setShowDropdown(false);
                  }}
                >
                  {item.description
                    ? `${item.name}, ${item.description}`
                    : item.name}
                </a>
              </li>
            )}
          </For>
        </ul>
      )}
    </label>
  );
};

import { toasts } from '@/core/toasts';
import { trimStringOverflow } from '@/helpers/trim-string-overflow';
import { ToastProps } from '@/types/toasts';
import { createSignal, For, Show } from 'solid-js';

const Toast = (props: ToastProps) => {
  const [visible, setVisible] = createSignal(true);

  // toggle transition flag after 2 seconds
  setTimeout(() => setVisible(false), 2000);

  // Show condition for toast with description
  return (
    <div
      class={`${visible() ? 'opacity-100' : 'opacity-0'}`}
      style={{ transition: 'opacity 1s ease-in-out' }}
    >
      <div class={`inline-block w-auto alert ${props.style}`}>
        <div>
          <span class="font-bold">{props.title}</span>
          <Show when={props.description} fallback={<></>}>
            <br />
            <span class="text-sm fade-text">
              {trimStringOverflow(props.description!, 25)}
            </span>
          </Show>
        </div>
      </div>
    </div>
  );
};

export const Toaster = () => {
  return (
    <div class="z-[100] toast toast-bottom toast-end opacity-50 flex flex-col items-end">
      <For each={toasts()}>
        {(toast) => (
          <Toast
            title={toast.title}
            description={toast.description}
            style={toast.style}
          />
        )}
      </For>
    </div>
  );
};

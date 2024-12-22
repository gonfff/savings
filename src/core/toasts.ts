import { Toast, ToastProps } from '@/types/toasts';
import { createSignal } from 'solid-js';

const [toasts, setToasts] = createSignal<Toast[]>([]);

const addToast = (props: ToastProps) => {
  const id = Math.random().toString(36).substring(2, 9);
  setToasts((prev) => [
    ...prev,
    {
      id,
      title: props.title,
      description: props.description,
      style: props.style,
    },
  ]);
  setTimeout(() => {
    removeToast(id);
  }, 3000);
};

const removeToast = (id: string) => {
  setToasts((prev) => prev.filter((t) => t.id !== id));
};

export { addToast, toasts };

import { createSignal, JSX } from 'solid-js';

export const TableRowButton = () => {
  return (
    <div class="dropdown dropdown-end">
      <div
        tabindex="0"
        role="button"
        class="btn btn-square btn-outline border-0 btn-xs"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M5 6.5H19V8H5V6.5Z" fill="#1F2328" />
          <path d="M5 16.5H19V18H5V16.5Z" fill="#1F2328" />
          <path d="M5 11.5H19V13H5V11.5Z" fill="#1F2328" />
        </svg>
      </div>
      <ul
        tabindex="0"
        class="dropdown-content menu bg-base-100 z-[1] w-32 p-2 shadow"
      >
        <li>
          <a>Edit</a>
        </li>
        <li>
          <a>Delete</a>
        </li>
      </ul>
    </div>
  );
};

export interface ModalWindowButtonProps {
  isOpen: () => boolean;
  setIsOpen: (value: boolean) => void;
  buttonTitle: string;
  modaltitle: string;
  form: (
    formData: Record<string, unknown>,
    setFormData: (newData: Record<string, unknown>) => void,
  ) => JSX.Element;
  actionButtonTitle: string | undefined;
  actionButtonHandler: (formData: Record<string, unknown>) => Promise<void>;
}

export const ModalWindowButton = (props: ModalWindowButtonProps) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [formData, setFormData] = createSignal<Record<string, unknown>>({});

  const handleSubmit = async () => {
    try {
      await props.actionButtonHandler(formData());
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div>
      <button class="btn btn-primary" onClick={() => setIsOpen(true)}>
        {props.buttonTitle}
      </button>

      {isOpen() && (
        <div
          class="modal modal-open"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div class="modal-box">
            <h3 class="font-bold text-lg">{props.modaltitle}</h3>
            {props.form(formData(), setFormData)}
            <div class="modal-action">
              {props.actionButtonTitle ? (
                <button
                  type="submit"
                  class="btn btn-primary"
                  onClick={handleSubmit}
                >
                  {props.actionButtonTitle}
                </button>
              ) : null}
              <button class="btn" onClick={() => setIsOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

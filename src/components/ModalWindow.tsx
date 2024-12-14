import { createSignal, JSX } from 'solid-js';

type ModalWindowProps = {
  formData: Record<string, string>; // Form data
  setFormData: (key: string, value: string) => void; // Form data event handler
  title: string; // Modal window title
  text: string; // Modal window description
  triggerButton: JSX.Element; // Open modal window button
  actionButtonCallback: (formData: Record<string, string>) => void; // Callback function for action button
  children: (setFormData: (key: string, value: string) => void) => JSX.Element; // Modal window content
};

type ModalTextProps = {
  text: string;
};

export const ModalWindow = (props: ModalWindowProps) => {
  const [isOpen, setIsOpen] = createSignal(true);
  let formData: Record<string, string> = {};
  console.log('initial formData', formData);
  const setFormData = (key: string, value: string) => {
    formData[key] = value;
  };

  return (
    <div>
      <div onClick={() => setIsOpen(true)}>{props.triggerButton}</div>

      {isOpen() && (
        <div
          class="modal modal-open"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div class="modal-box">
            <ModalTitle text={props.title} />
            <ModalText text={props.text} />
            {props.children(setFormData)}
            <div class="modal-action">
              <button
                class="btn btn-primary"
                onClick={() => {
                  props.actionButtonCallback(formData);
                  setIsOpen(false);
                  formData = {};
                  console.log('formData after action', formData);
                }}
              >
                Save
              </button>
              <button
                class="btn"
                onClick={() => {
                  setIsOpen(false);
                  formData = {};
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const ModalTitle = (props: ModalTextProps) => {
  return <h3 class="font-bold text-lg">{props.text}</h3>;
};

export const ModalText = (props: ModalTextProps) => {
  return <p class="text-sm opacity-50">{props.text}</p>;
};

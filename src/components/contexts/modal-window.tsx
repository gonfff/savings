import { ModalWindowProps } from '@/types/modal-window';
import { createContext, createSignal, JSX, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';

// Create a context to store trigger for reloading the page
const ModalContext = createContext<{
  isOpen: () => boolean;
  setIsOpen: (value: boolean) => void;
  currentData: ModalWindowProps;
  setCurrentData: (data: Partial<ModalWindowProps>) => void;
}>();

export const ModalProvider = (props: { children: JSX.Element }) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [currentData, setCurrentData] = createStore<ModalWindowProps>({
    inputs: [],
    // setInputs: (inputs: inputValue[]) => {},
    isOpen: () => false,
    setIsOpen: () => {},
    title: '',
    comment: '',
    actionButton: () => {},
  });

  return (
    <ModalContext.Provider
      value={{ isOpen, setIsOpen, currentData, setCurrentData }}
    >
      {props.children}
    </ModalContext.Provider>
  );
};

export const getModalContext = (): {
  isOpen: () => boolean;
  setIsOpen: (value: boolean) => void;
  currentData: ModalWindowProps;
  setCurrentData: (data: Partial<ModalWindowProps>) => void;
} => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('getModalContext must be used within a ModalProvider');
  }
  return context;
};

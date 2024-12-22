import { ModalWindowProps } from '@/types/modal-window';
import { createContext, createSignal, JSX, useContext } from 'solid-js';

// Create a context to store trigger for reloading the page
const ModalContext = createContext<{
  isOpen: () => boolean;
  setIsOpen: (value: boolean) => void;
  currentData: () => any;
  setCurrentData: (data: any) => void;
}>();

export const ModalProvider = (props: { children: JSX.Element }) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [currentData, setCurrentData] = createSignal<any>(null);

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
  currentData: () => ModalWindowProps;
  setCurrentData: (data: ModalWindowProps) => void;
} => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('getModalContext must be used within a ModalProvider');
  }
  return context;
};

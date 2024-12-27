import { Input, inputValue } from './inputs';

export interface ModalWindowProps {
  inputs: Input[]; // List of input fields
  isOpen: () => boolean; // Modal window open state
  setIsOpen: (state: boolean) => void; // Modal window open state event handler
  title: string; // Modal window title
  comment?: string; // Modal window description
  actionButton: (formData: Record<string, inputValue>) => void; // Callback function for action button
}

export type ModalTextProps = {
  text: string;
};

import { DropdownInputProps, StringInputProps } from '@/types/inputs';

export interface queryItem {
  id: number;
  name: string;
  description?: string;
}

export interface Input {
  input: StringInputProps | DropdownInputProps;
  inputType: 'DropdownInput' | 'StringInput';
  key: string;
}
export interface ModalWindowProps {
  formInputs: Input[];
  isOpen: () => boolean; // Modal window open state
  setIsOpen: (state: boolean) => void; // Modal window open state event handler
  title: string; // Modal window title
  comment?: string; // Modal window description
  actionButton: (formData: Record<string, string>) => void; // Callback function for action button
}

export type ModalTextProps = {
  text: string;
};

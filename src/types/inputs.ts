import { queryItem } from '@/types/modal-window';

export interface StringInputProps {
  name: string;
  type: string;
  placeholder?: string;
  value?: string;
  required?: boolean;
}

export interface DropdownInputProps {
  name: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  item?: queryItem;
  fetchFunction?: (query: string) => Promise<any[]>;
  setCustomInputData?: (key: string, value: string) => void;
}

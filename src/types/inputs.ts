export enum inputType {
  DropdownInput = 'DropdownInput',
  StringInput = 'StringInput',
}

export enum inputDataTypes {
  String = 'string',
  Number = 'number',
  Date = 'date',
}

export interface inputValue {
  value: string | number;
  id: number;
  description?: string;
}

export interface Input {
  type: inputType;
  key: string;
  title: string;
  placeholder?: string;
  required?: boolean;
  value: inputValue;
  dataType?: inputDataTypes;
  fetchFunction?: (query: string) => Promise<any[]>;
  validationFunction?: (value: inputValue) => boolean;
}

export interface InputProps {
  input: Input;
  setter: (value: inputValue) => void;
}

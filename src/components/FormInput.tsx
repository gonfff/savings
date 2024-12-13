type FormInputProps = {
  name: string; // Input name
  placeholder?: string; // Input placeholder
  type: string; // Input type
  setFormData?: (key: string, value: string) => void; // Input event handler
  value?: string; // Input value
  updateFormField?: any;
};

export const FormInput = (props: FormInputProps) => {
  return (
    <div class="form-control">
      <label class="block py-4 block font-medium text-sm" for={props.name}>
        {props.name.charAt(0).toUpperCase() + props.name.slice(1)}
        <input
          class="placeholder:italic placeholder:text-slate-400 block w-full border py-2 pl-2 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 no-arrows"
          value={props.value || ''}
          placeholder={props.placeholder || ''}
          type={props.type}
          name={props.name}
          onInput={(e) =>
            props.setFormData &&
            props.setFormData(props.name, (e.target as HTMLInputElement).value)
          }
          onChange={props.updateFormField && props.updateFormField(props.name)}
        />
      </label>
    </div>
  );
};

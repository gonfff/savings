import { createStore } from 'solid-js/store';

const submit = (form: any) => {
  // here we can:
  // filter out unneeded data, e.g. the checkbox sameAsAddress
  // map fields, if needed, e.g. shipping_address
  const dataToSubmit = { ...form };
  // should be submitting your form to some backend service
  console.log(`submitting ${JSON.stringify(dataToSubmit)}`);
};
const useForm = (fieldsData: any) => {
  const defaultValues = JSON.parse(JSON.stringify(fieldsData));
  const valueForForm = JSON.parse(JSON.stringify(fieldsData));
  const [form, setForm] = createStore<any>(valueForForm);

  const clearField = (fieldName: string) => {
    setForm({
      [fieldName]: '',
    });
  };

  const updateFormField = (fieldName: string) => (event: Event) => {
    const inputElement = event.currentTarget as HTMLInputElement;
    setForm({
      [fieldName]: inputElement.value,
    });
  };

  const setDefaultValues = () => {
    Object.keys(form).map((item) =>
      setForm({
        [item]: defaultValues[item],
      }),
    );
  };

  return {
    form,
    submit,
    updateFormField,
    setDefaultValues,
    clearField,
  };
};

export default useForm;

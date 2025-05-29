
import { FormBuilder } from '@/components/FormBuilder';
import { useFormStore } from '@/store/formStore';
import { useEffect } from 'react';

const FormBuilderPage = () => {
  const { currentForm, createForm } = useFormStore();

  useEffect(() => {
    if (!currentForm) {
      createForm('Untitled Form');
    }
  }, [currentForm, createForm]);

  return <FormBuilder />;
};

export default FormBuilderPage;

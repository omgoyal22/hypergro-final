
import { useParams } from 'react-router-dom';
import { useFormStore } from '@/store/formStore';
import { FormPreview } from '@/components/FormBuilder/FormPreview';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const FormFiller = () => {
  const { id } = useParams<{ id: string }>();
  const { forms, addFormResponse } = useFormStore();
  
  const form = forms.find(f => f.id === id);

  const handleSubmit = (responses: Record<string, any>) => {
    if (id) {
      addFormResponse(id, responses);
    }
  };

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Form Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The form you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => window.location.href = '/'}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto py-8">
        <FormPreview 
          formId={id} 
          onSubmit={handleSubmit} 
          isPublic={true}
        />
      </div>
    </div>
  );
};

export default FormFiller;

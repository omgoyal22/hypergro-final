
import { useFormStore } from '@/store/formStore';
import { FieldPanel } from './FieldPanel';
import { FormCanvas } from './FormCanvas';
import { FieldEditor } from './FieldEditor';
import { FormBuilderHeader } from './FormBuilderHeader';
import { FormPreview } from './FormPreview';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export const FormBuilder = () => {
  const { currentForm, selectedFieldId } = useFormStore();
  const [showPreview, setShowPreview] = useState(false);

  const selectedField = currentForm?.fields.find(f => f.id === selectedFieldId);

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-800">
      <FormBuilderHeader />
      
      <div className="flex-1 flex overflow-hidden">
        <FieldPanel />
        
        <div className="flex-1 flex">
          {showPreview ? (
            <div className="flex-1 relative">
              <div className="absolute top-4 right-4 z-10">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(false)}
                >
                  Back to Editor
                </Button>
              </div>
              <FormPreview />
            </div>
          ) : (
            <FormCanvas />
          )}
        </div>
        
        {selectedField && !showPreview && (
          <FieldEditor field={selectedField} />
        )}
      </div>
    </div>
  );
};

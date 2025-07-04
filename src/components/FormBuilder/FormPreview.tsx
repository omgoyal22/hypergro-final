
import { useFormStore } from '@/store/formStore';
import { FieldRenderer } from './FieldTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface FormPreviewProps {
  formId?: string;
  onSubmit?: (responses: Record<string, any>) => void;
  isPublic?: boolean;
}

export const FormPreview = ({ formId, onSubmit, isPublic = false }: FormPreviewProps) => {
  const { currentForm, forms, previewMode } = useFormStore();
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const form = formId ? forms.find(f => f.id === formId) : currentForm;

  if (!form) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No form to preview</p>
      </div>
    );
  }

  const validateField = (field: any, value: any) => {
    const errors: string[] = [];

    if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      errors.push('This field is required');
    }

    if (value && field.validation) {
      if (field.validation.minLength && value.length < field.validation.minLength) {
        errors.push(`Minimum length is ${field.validation.minLength}`);
      }
      if (field.validation.maxLength && value.length > field.validation.maxLength) {
        errors.push(`Maximum length is ${field.validation.maxLength}`);
      }
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errors.push('Please enter a valid email address');
      }
    }

    if (field.type === 'phone' && value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        errors.push('Please enter a valid phone number');
      }
    }

    return errors[0] || null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    form.fields.forEach(field => {
      const error = validateField(field, responses[field.id]);
      if (error) {
        newErrors[field.id] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit?.(responses);
      if (isPublic) {
        alert('Form submitted successfully!');
        setResponses({});
      }
    }
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setResponses(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const getPreviewStyles = () => {
    switch (previewMode) {
      case 'mobile':
        return {
          container: 'w-full max-w-sm mx-auto px-2',
          card: 'mx-2',
          spacing: 'space-y-4',
          button: 'w-full text-sm py-2'
        };
      case 'tablet':
        return {
          container: 'w-full max-w-md mx-auto px-4',
          card: 'mx-4',
          spacing: 'space-y-5',
          button: 'w-full'
        };
      default: // desktop
        return {
          container: 'w-full max-w-2xl mx-auto px-6',
          card: 'mx-6',
          spacing: 'space-y-6',
          button: 'w-full'
        };
    }
  };

  const styles = getPreviewStyles();

  return (
    <div className="w-full h-full overflow-auto bg-gray-50 dark:bg-gray-900 p-4">
      <div className={`transition-all duration-300 ${styles.container}`}>
        <Card className={`shadow-lg ${styles.card}`}>
          <CardHeader className={previewMode === 'mobile' ? 'pb-4' : 'pb-6'}>
            <CardTitle className={`${previewMode === 'mobile' ? 'text-xl' : 'text-2xl'}`}>
              {form.title}
            </CardTitle>
            {form.description && (
              <p className={`text-gray-600 dark:text-gray-300 ${previewMode === 'mobile' ? 'text-sm' : ''}`}>
                {form.description}
              </p>
            )}
          </CardHeader>
          <CardContent className={previewMode === 'mobile' ? 'px-4' : 'px-6'}>
            <form onSubmit={handleSubmit} className={styles.spacing}>
              {form.fields.map((field) => (
                <div key={field.id}>
                  <FieldRenderer
                    field={field}
                    value={responses[field.id]}
                    onChange={(value) => handleFieldChange(field.id, value)}
                    error={errors[field.id]}
                    isPreview={true}
                  />
                </div>
              ))}
              
              {form.fields.length > 0 && (
                <Button type="submit" className={styles.button}>
                  Submit Form
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

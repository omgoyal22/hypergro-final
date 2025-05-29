
import { useFormStore, FormField } from '@/store/formStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FieldEditorProps {
  field: FormField;
}

export const FieldEditor = ({ field }: FieldEditorProps) => {
  const { updateField, removeField } = useFormStore();
  const [localField, setLocalField] = useState(field);

  useEffect(() => {
    setLocalField(field);
  }, [field]);

  const handleUpdate = (updates: Partial<FormField>) => {
    const updatedField = { ...localField, ...updates };
    setLocalField(updatedField);
    updateField(field.id, updates);
  };

  const handleOptionsChange = (value: string) => {
    const options = value.split('\n').filter(option => option.trim() !== '');
    handleUpdate({ options });
  };

  return (
    <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Field Settings</h3>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => removeField(field.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={localField.label}
            onChange={(e) => handleUpdate({ label: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="placeholder">Placeholder</Label>
          <Input
            id="placeholder"
            value={localField.placeholder || ''}
            onChange={(e) => handleUpdate({ placeholder: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="helpText">Help Text</Label>
          <Input
            id="helpText"
            value={localField.helpText || ''}
            onChange={(e) => handleUpdate({ helpText: e.target.value })}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="required"
            checked={localField.required}
            onCheckedChange={(checked) => handleUpdate({ required: checked })}
          />
          <Label htmlFor="required">Required</Label>
        </div>

        {field.type === 'dropdown' && (
          <div>
            <Label htmlFor="options">Options (one per line)</Label>
            <Textarea
              id="options"
              value={localField.options?.join('\n') || ''}
              onChange={(e) => handleOptionsChange(e.target.value)}
              rows={4}
            />
          </div>
        )}

        {(field.type === 'text' || field.type === 'textarea' || field.type === 'email') && (
          <>
            <div>
              <Label htmlFor="minLength">Min Length</Label>
              <Input
                id="minLength"
                type="number"
                value={localField.validation?.minLength || ''}
                onChange={(e) => handleUpdate({
                  validation: {
                    ...localField.validation,
                    minLength: e.target.value ? parseInt(e.target.value) : undefined
                  }
                })}
              />
            </div>

            <div>
              <Label htmlFor="maxLength">Max Length</Label>
              <Input
                id="maxLength"
                type="number"
                value={localField.validation?.maxLength || ''}
                onChange={(e) => handleUpdate({
                  validation: {
                    ...localField.validation,
                    maxLength: e.target.value ? parseInt(e.target.value) : undefined
                  }
                })}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

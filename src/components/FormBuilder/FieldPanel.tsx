
import { fieldTypes } from './FieldTypes';
import { useFormStore } from '@/store/formStore';
import { Card, CardContent } from '@/components/ui/card';

export const FieldPanel = () => {
  const addField = useFormStore((state) => state.addField);

  const handleAddField = (type: any) => {
    const defaultField = {
      type,
      label: `${fieldTypes.find(ft => ft.type === type)?.label || 'Field'}`,
      required: false,
      placeholder: type === 'dropdown' ? 'Select an option' : `Enter ${type}...`,
      options: type === 'dropdown' ? ['Option 1', 'Option 2', 'Option 3'] : undefined,
    };

    addField(defaultField);
  };

  return (
    <div className="w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Form Fields</h3>
      <div className="space-y-2">
        {fieldTypes.map((fieldType) => (
          <Card
            key={fieldType.type}
            className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            onClick={() => handleAddField(fieldType.type)}
          >
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{fieldType.icon}</span>
                <span className="text-sm font-medium">{fieldType.label}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

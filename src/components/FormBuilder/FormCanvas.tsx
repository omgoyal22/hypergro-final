
import { useFormStore } from '@/store/formStore';
import { FieldRenderer } from './FieldTypes';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Pencil } from 'lucide-react';
import { useState } from 'react';

export const FormCanvas = () => {
  const { currentForm, selectedFieldId, selectField, reorderFields } = useFormStore();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  if (!currentForm) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No Form Selected
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Create a new form or select an existing one to start building.
          </p>
        </div>
      </div>
    );
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      reorderFields(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-800 p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {currentForm.title}
          </h2>
          {currentForm.description && (
            <p className="text-gray-600 dark:text-gray-300">{currentForm.description}</p>
          )}
        </div>

        {currentForm.fields.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Drag and drop fields from the left panel to start building your form.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {currentForm.fields.map((field, index) => (
              <Card
                key={field.id}
                className={`relative group cursor-pointer transition-all ${
                  selectedFieldId === field.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => selectField(field.id)}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1 opacity-50 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <FieldRenderer field={field} isPreview={false} />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectField(field.id);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

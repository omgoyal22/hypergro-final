
import { useFormStore } from '@/store/formStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Undo, 
  Redo, 
  Save, 
  Sun, 
  Moon,
  Eye,
  Share
} from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FormPreview } from './FormPreview';

export const FormBuilderHeader = () => {
  const {
    currentForm,
    previewMode,
    setPreviewMode,
    theme,
    setTheme,
    saveForm,
    undo,
    redo,
    history,
    historyIndex,
    updateForm,
    addFormResponse
  } = useFormStore();
  
  const [showPreview, setShowPreview] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleSave = () => {
    saveForm();
    console.log('Form saved successfully!');
  };

  const handleShare = () => {
    if (currentForm) {
      saveForm();
      const shareUrl = `${window.location.origin}/form/${currentForm.id}`;
      navigator.clipboard.writeText(shareUrl);
      alert('Form link copied to clipboard!');
    }
  };

  const handlePreviewSubmit = (responses: Record<string, any>) => {
    if (currentForm) {
      addFormResponse(currentForm.id, responses);
      setShowPreview(false);
      alert('Test submission recorded!');
    }
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Input
              value={currentForm?.title || ''}
              onChange={(e) => updateForm({ title: e.target.value })}
              className="text-lg font-semibold border-none shadow-none focus:border-blue-500"
              placeholder="Untitled Form"
            />
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={!canUndo}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={!canRedo}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center border rounded-md p-1">
            <Button
              variant={previewMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('desktop')}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={previewMode === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('tablet')}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={previewMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('mobile')}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>

          <Dialog open={showPreview} onOpenChange={setShowPreview}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[80vh]">
              <DialogHeader>
                <DialogTitle>Form Preview</DialogTitle>
              </DialogHeader>
              <FormPreview onSubmit={handlePreviewSubmit} />
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>

          <Button onClick={handleSave} size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

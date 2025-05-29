
import { useFormStore } from '@/store/formStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2, Share, BarChart3 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const Dashboard = () => {
  const { forms, responses, createForm, loadForm } = useFormStore();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newFormTitle, setNewFormTitle] = useState('');
  const [showResponses, setShowResponses] = useState<string | null>(null);

  const handleCreateForm = () => {
    if (newFormTitle.trim()) {
      createForm(newFormTitle.trim());
      setNewFormTitle('');
      setShowCreateDialog(false);
      window.location.href = '/builder';
    }
  };

  const handleShareForm = (formId: string) => {
    const shareUrl = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Form link copied to clipboard!');
  };

  const getFormResponses = (formId: string) => {
    return responses.filter(r => r.formId === formId);
  };

  const templates = [
    {
      id: 'contact',
      title: 'Contact Form',
      description: 'Basic contact form with name, email, and message',
      fields: [
        { type: 'text', label: 'Name', required: true },
        { type: 'email', label: 'Email', required: true },
        { type: 'textarea', label: 'Message', required: true }
      ]
    },
    {
      id: 'survey',
      title: 'Customer Survey',
      description: 'Customer satisfaction survey template',
      fields: [
        { type: 'text', label: 'Name', required: false },
        { type: 'dropdown', label: 'Rating', options: ['Excellent', 'Good', 'Average', 'Poor'], required: true },
        { type: 'textarea', label: 'Comments', required: false }
      ]
    }
  ];

  const handleUseTemplate = (template: any) => {
    createForm(template.title);
    // Add template fields logic would go here
    window.location.href = '/builder';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Form Builder Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Create and manage your forms with ease
            </p>
          </div>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Form
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Form</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Enter form title..."
                  value={newFormTitle}
                  onChange={(e) => setNewFormTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateForm()}
                />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateForm}>Create</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Templates Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Quick Start Templates
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleUseTemplate(template)}
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Forms Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Your Forms ({forms.length})
          </h2>
          
          {forms.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  You haven't created any forms yet.
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Form
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {forms.map((form) => {
                const formResponses = getFormResponses(form.id);
                return (
                  <Card key={form.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{form.title}</CardTitle>
                          <CardDescription>
                            Created {new Date(form.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">
                          {formResponses.length} responses
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {form.fields.length} fields
                        </p>
                        
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              loadForm(form.id);
                              window.location.href = '/builder';
                            }}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/form/${form.id}`, '_blank')}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleShareForm(form.id)}
                          >
                            <Share className="h-3 w-3 mr-1" />
                            Share
                          </Button>
                          
                          {formResponses.length > 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowResponses(form.id)}
                            >
                              <BarChart3 className="h-3 w-3 mr-1" />
                              Responses
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Responses Dialog */}
        <Dialog open={!!showResponses} onOpenChange={() => setShowResponses(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Form Responses</DialogTitle>
            </DialogHeader>
            {showResponses && (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {getFormResponses(showResponses).map((response) => (
                  <Card key={response.id}>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        Submitted: {new Date(response.submittedAt).toLocaleString()}
                      </div>
                      <div className="space-y-2">
                        {Object.entries(response.responses).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium">{key}: </span>
                            <span>{JSON.stringify(value)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;

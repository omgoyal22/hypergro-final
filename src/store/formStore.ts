
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'dropdown' | 'checkbox' | 'date' | 'email' | 'phone' | 'number';
  label: string;
  placeholder?: string;
  required: boolean;
  helpText?: string;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  step?: number;
}

export interface FormStep {
  id: string;
  title: string;
  fields: FormField[];
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  steps: FormStep[];
  isMultiStep: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FormResponse {
  id: string;
  formId: string;
  responses: Record<string, any>;
  submittedAt: string;
}

interface FormBuilderState {
  currentForm: Form | null;
  forms: Form[];
  responses: FormResponse[];
  history: Form[];
  historyIndex: number;
  isDragging: boolean;
  selectedFieldId: string | null;
  previewMode: 'desktop' | 'tablet' | 'mobile';
  theme: 'light' | 'dark';
  
  // Actions
  createForm: (title: string) => void;
  updateForm: (form: Partial<Form>) => void;
  addField: (field: Omit<FormField, 'id'>) => void;
  updateField: (id: string, updates: Partial<FormField>) => void;
  removeField: (id: string) => void;
  reorderFields: (fromIndex: number, toIndex: number) => void;
  selectField: (id: string | null) => void;
  setPreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  saveForm: () => void;
  loadForm: (id: string) => void;
  addFormResponse: (formId: string, responses: Record<string, any>) => void;
  undo: () => void;
  redo: () => void;
  setDragging: (isDragging: boolean) => void;
}

export const useFormStore = create<FormBuilderState>()(
  persist(
    (set, get) => ({
      currentForm: null,
      forms: [],
      responses: [],
      history: [],
      historyIndex: -1,
      isDragging: false,
      selectedFieldId: null,
      previewMode: 'desktop',
      theme: 'light',

      createForm: (title: string) => {
        const newForm: Form = {
          id: `form_${Date.now()}`,
          title,
          fields: [],
          steps: [],
          isMultiStep: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          currentForm: newForm,
          history: [newForm],
          historyIndex: 0,
        }));
      },

      updateForm: (updates: Partial<Form>) => {
        const state = get();
        if (!state.currentForm) return;

        const updatedForm = {
          ...state.currentForm,
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(updatedForm);

        set({
          currentForm: updatedForm,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      addField: (field: Omit<FormField, 'id'>) => {
        const state = get();
        if (!state.currentForm) return;

        const newField: FormField = {
          ...field,
          id: `field_${Date.now()}`,
        };

        const updatedFields = [...state.currentForm.fields, newField];
        state.updateForm({ fields: updatedFields });
      },

      updateField: (id: string, updates: Partial<FormField>) => {
        const state = get();
        if (!state.currentForm) return;

        const updatedFields = state.currentForm.fields.map(field =>
          field.id === id ? { ...field, ...updates } : field
        );
        
        state.updateForm({ fields: updatedFields });
      },

      removeField: (id: string) => {
        const state = get();
        if (!state.currentForm) return;

        const updatedFields = state.currentForm.fields.filter(field => field.id !== id);
        state.updateForm({ fields: updatedFields });
        
        if (state.selectedFieldId === id) {
          set({ selectedFieldId: null });
        }
      },

      reorderFields: (fromIndex: number, toIndex: number) => {
        const state = get();
        if (!state.currentForm) return;

        const fields = [...state.currentForm.fields];
        const [movedField] = fields.splice(fromIndex, 1);
        fields.splice(toIndex, 0, movedField);
        
        state.updateForm({ fields });
      },

      selectField: (id: string | null) => {
        set({ selectedFieldId: id });
      },

      setPreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => {
        set({ previewMode: mode });
      },

      setTheme: (theme: 'light' | 'dark') => {
        set({ theme });
        document.documentElement.classList.toggle('dark', theme === 'dark');
      },

      saveForm: () => {
        const state = get();
        if (!state.currentForm) return;

        const existingIndex = state.forms.findIndex(f => f.id === state.currentForm!.id);
        const updatedForms = existingIndex >= 0 
          ? state.forms.map((f, i) => i === existingIndex ? state.currentForm! : f)
          : [...state.forms, state.currentForm];

        set({ forms: updatedForms });
      },

      loadForm: (id: string) => {
        const state = get();
        const form = state.forms.find(f => f.id === id);
        if (form) {
          set({
            currentForm: form,
            history: [form],
            historyIndex: 0,
            selectedFieldId: null,
          });
        }
      },

      addFormResponse: (formId: string, responses: Record<string, any>) => {
        const newResponse: FormResponse = {
          id: `response_${Date.now()}`,
          formId,
          responses,
          submittedAt: new Date().toISOString(),
        };

        set((state) => ({
          responses: [...state.responses, newResponse],
        }));
      },

      undo: () => {
        const state = get();
        if (state.historyIndex > 0) {
          const newIndex = state.historyIndex - 1;
          set({
            currentForm: state.history[newIndex],
            historyIndex: newIndex,
          });
        }
      },

      redo: () => {
        const state = get();
        if (state.historyIndex < state.history.length - 1) {
          const newIndex = state.historyIndex + 1;
          set({
            currentForm: state.history[newIndex],
            historyIndex: newIndex,
          });
        }
      },

      setDragging: (isDragging: boolean) => {
        set({ isDragging });
      },
    }),
    {
      name: 'form-builder-storage',
      partialize: (state) => ({
        forms: state.forms,
        responses: state.responses,
        theme: state.theme,
      }),
    }
  )
);

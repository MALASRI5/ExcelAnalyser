import React, { useState } from 'react';
import { format } from 'date-fns';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { Reminder, CATEGORIES, PRIORITIES, Category, Priority } from '../../types';

interface ReminderFormProps {
  initialValues?: Partial<Reminder>;
  onSubmit: (values: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  submitLabel: string;
  isSubmitting: boolean;
}

const ReminderForm = ({
  initialValues = {},
  onSubmit,
  submitLabel,
  isSubmitting,
}: ReminderFormProps) => {
  const [title, setTitle] = useState(initialValues.title || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [dueDate, setDueDate] = useState(
    initialValues.dueDate 
      ? format(new Date(initialValues.dueDate), "yyyy-MM-dd'T'HH:mm")
      : format(new Date(Date.now() + 24 * 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm") // Default to tomorrow
  );
  const [category, setCategory] = useState<Category>(initialValues.category || 'other');
  const [priority, setPriority] = useState<Priority>(initialValues.priority || 'medium');
  const [completed, setCompleted] = useState(initialValues.completed || false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      dueDate: new Date(dueDate).toISOString(),
      category,
      priority,
      completed,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-card p-6">
      <Input
        label="Title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter reminder title"
        error={errors.title}
        required
      />
      
      <TextArea
        label="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter reminder details"
        rows={4}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Due Date and Time"
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          error={errors.dueDate}
          required
        />
        
        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          options={CATEGORIES.map((cat) => ({ value: cat, label: cat.charAt(0).toUpperCase() + cat.slice(1) }))}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          options={PRIORITIES.map((pri) => ({ value: pri, label: pri.charAt(0).toUpperCase() + pri.slice(1) }))}
        />
        
        <div className="flex items-center mb-4 mt-8">
          <input
            id="completed"
            type="checkbox"
            className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
          <label htmlFor="completed" className="ml-2 block text-sm text-neutral-700">
            Mark as completed
          </label>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4 mt-6">
        <Button type="button" variant="secondary" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default ReminderForm;
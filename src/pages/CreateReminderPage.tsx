import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ReminderForm from '../components/reminders/ReminderForm';
import { useReminders } from '../contexts/ReminderContext';
import { Reminder } from '../types';

const CreateReminderPage = () => {
  const { addReminder } = useReminders();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (values: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);
    try {
      const newReminder = addReminder(values);
      navigate(`/reminders/${newReminder.id}`);
    } catch (error) {
      console.error('Error creating reminder:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <Link to="/" className="flex items-center text-neutral-600 hover:text-neutral-900">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to reminders</span>
        </Link>
      </div>
      
      <h1 className="text-2xl font-semibold mb-6">Create New Reminder</h1>
      
      <ReminderForm
        onSubmit={handleSubmit}
        submitLabel="Create Reminder"
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default CreateReminderPage;
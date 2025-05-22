import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ReminderForm from '../components/reminders/ReminderForm';
import { useReminders } from '../contexts/ReminderContext';
import { Reminder } from '../types';

const EditReminderPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getReminder, updateReminder } = useReminders();
  const [reminder, setReminder] = useState<Reminder | undefined>(
    id ? getReminder(id) : undefined
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const reminderData = getReminder(id);
      setReminder(reminderData);
      
      if (!reminderData) {
        navigate('/');
      }
    }
  }, [id, getReminder, navigate]);

  const handleSubmit = (values: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      const updatedReminder = updateReminder(id, values);
      if (updatedReminder) {
        navigate(`/reminders/${updatedReminder.id}`);
      }
    } catch (error) {
      console.error('Error updating reminder:', error);
      setIsSubmitting(false);
    }
  };

  if (!reminder) {
    return null;
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <Link to={`/reminders/${id}`} className="flex items-center text-neutral-600 hover:text-neutral-900">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to reminder</span>
        </Link>
      </div>
      
      <h1 className="text-2xl font-semibold mb-6">Edit Reminder</h1>
      
      <ReminderForm
        initialValues={reminder}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default EditReminderPage;
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit2, 
  Trash2, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Tag,
  AlertTriangle
} from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useReminders } from '../contexts/ReminderContext';
import { formatDateTime, formatRelativeTime, getPriorityColor, getCategoryColor, isOverdue } from '../utils/helpers';

const ReminderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getReminder, toggleReminderCompleted, deleteReminder } = useReminders();
  const [reminder, setReminder] = useState(id ? getReminder(id) : undefined);
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
  
  if (!reminder) {
    return null;
  }
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      deleteReminder(reminder.id);
      navigate('/');
    }
  };
  
  const overdue = !reminder.completed && isOverdue(reminder.dueDate);
  
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="flex items-center text-neutral-600 hover:text-neutral-900">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to reminders</span>
        </Link>
        
        <div className="flex space-x-2">
          <Link to={`/reminders/${reminder.id}/edit`}>
            <Button variant="secondary" className="flex items-center">
              <Edit2 className="h-4 w-4 mr-1" />
              <span>Edit</span>
            </Button>
          </Link>
          
          <Button variant="danger" className="flex items-center" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-1" />
            <span>Delete</span>
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-card p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className={`text-2xl font-semibold mb-2 ${reminder.completed ? 'line-through text-neutral-500' : ''}`}>
              {reminder.title}
            </h1>
            
            <div className="flex items-center space-x-4 mb-4">
              <Badge color={getPriorityColor(reminder.priority)}>
                {reminder.priority} priority
              </Badge>
              
              <Badge color={getCategoryColor(reminder.category)}>
                {reminder.category}
              </Badge>
              
              {reminder.completed ? (
                <span className="flex items-center text-sm text-accent-600">
                  <CheckCircle className="h-4 w-4 mr-1 fill-accent-500" />
                  Completed
                </span>
              ) : overdue ? (
                <span className="flex items-center text-sm text-error-600 font-medium">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Overdue
                </span>
              ) : null}
            </div>
          </div>
          
          <Button
            onClick={() => toggleReminderCompleted(reminder.id)}
            variant={reminder.completed ? 'secondary' : 'primary'}
            className="flex items-center"
          >
            <CheckCircle className={`h-4 w-4 mr-1 ${reminder.completed ? 'fill-accent-500' : ''}`} />
            <span>{reminder.completed ? 'Mark incomplete' : 'Mark complete'}</span>
          </Button>
        </div>
        
        <div className="border-t border-b border-neutral-200 py-4 my-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-neutral-500 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-neutral-500">Due Date</p>
                <p className="text-neutral-800">{formatDateTime(reminder.dueDate)}</p>
                <p className="text-sm text-neutral-500 mt-1">{formatRelativeTime(reminder.dueDate)}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-neutral-500 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-neutral-500">Created</p>
                <p className="text-neutral-800">{formatDateTime(reminder.createdAt)}</p>
                <p className="text-sm text-neutral-500 mt-1">Last updated {formatRelativeTime(reminder.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-3">Description</h3>
          {reminder.description ? (
            <p className="text-neutral-700 whitespace-pre-line">{reminder.description}</p>
          ) : (
            <p className="text-neutral-500 italic">No description provided</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReminderDetailPage;
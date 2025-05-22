import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, Trash2, Edit2 } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Reminder } from '../../types';
import { 
  formatDate, 
  formatTime, 
  isOverdue,
  getPriorityColor,
  getCategoryColor,
  truncateText
} from '../../utils/helpers';
import { useReminders } from '../../contexts/ReminderContext';

interface ReminderCardProps {
  reminder: Reminder;
}

const ReminderCard = ({ reminder }: ReminderCardProps) => {
  const { toggleReminderCompleted, deleteReminder } = useReminders();
  const overdue = !reminder.completed && isOverdue(reminder.dueDate);

  return (
    <div 
      className={`card mb-4 animate-on-change ${reminder.completed ? 'opacity-70' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <button 
            onClick={() => toggleReminderCompleted(reminder.id)}
            className="mr-3 mt-1 text-neutral-400 hover:text-primary-500 transition-colors duration-200"
            aria-label={reminder.completed ? "Mark as incomplete" : "Mark as complete"}
          >
            <CheckCircle 
              className={`h-5 w-5 ${reminder.completed ? 'text-accent-500 fill-accent-500' : 'text-neutral-400'}`} 
            />
          </button>
          
          <div>
            <Link to={`/reminders/${reminder.id}`} className="block">
              <h3 className={`font-medium ${reminder.completed ? 'line-through text-neutral-500' : 'text-neutral-900'}`}>
                {reminder.title}
              </h3>
              
              {reminder.description && (
                <p className="text-neutral-600 text-sm mt-1">
                  {truncateText(reminder.description, 100)}
                </p>
              )}
            </Link>
            
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge color={getCategoryColor(reminder.category)}>
                {reminder.category}
              </Badge>
              
              <Badge color={getPriorityColor(reminder.priority)}>
                {reminder.priority}
              </Badge>
              
              <div className={`flex items-center text-xs ${overdue ? 'text-error-600' : 'text-neutral-500'}`}>
                <Clock className="h-3 w-3 mr-1" />
                <span>{formatDate(reminder.dueDate)}</span>
                <span className="mx-1">•</span>
                <span>{formatTime(reminder.dueDate)}</span>
                {overdue && <span className="ml-1 font-medium">(Overdue)</span>}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-1">
          <Link to={`/reminders/${reminder.id}/edit`}>
            <Button isIcon variant="secondary" size="sm" aria-label="Edit">
              <Edit2 className="h-4 w-4 text-neutral-600" />
            </Button>
          </Link>
          
          <Button 
            isIcon 
            variant="danger" 
            size="sm" 
            onClick={() => deleteReminder(reminder.id)}
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReminderCard;
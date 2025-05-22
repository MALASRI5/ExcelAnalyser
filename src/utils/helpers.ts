import { format, formatDistanceToNow, isAfter, parseISO } from 'date-fns';
import { Priority, Category } from '../types';

export function formatDate(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, 'MMM d, yyyy');
}

export function formatTime(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, 'h:mm a');
}

export function formatDateTime(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, 'MMM d, yyyy h:mm a');
}

export function formatRelativeTime(dateString: string): string {
  const date = parseISO(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
}

export function isOverdue(dueDate: string): boolean {
  return isAfter(new Date(), parseISO(dueDate));
}

export function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case 'high':
      return 'bg-error-500 text-white';
    case 'medium':
      return 'bg-warning-500 text-white';
    case 'low':
      return 'bg-success-500 text-white';
    default:
      return 'bg-neutral-500 text-white';
  }
}

export function getCategoryColor(category: Category): string {
  switch (category) {
    case 'work':
      return 'bg-primary-100 text-primary-800';
    case 'personal':
      return 'bg-accent-100 text-accent-800';
    case 'health':
      return 'bg-success-50 text-success-700';
    case 'finance':
      return 'bg-warning-50 text-warning-700';
    case 'errands':
      return 'bg-neutral-100 text-neutral-800';
    case 'other':
    default:
      return 'bg-neutral-100 text-neutral-800';
  }
}

export function getCategoryIcon(category: Category): string {
  switch (category) {
    case 'work':
      return 'briefcase';
    case 'personal':
      return 'user';
    case 'health':
      return 'heart';
    case 'finance':
      return 'dollar-sign';
    case 'errands':
      return 'shopping-bag';
    case 'other':
    default:
      return 'tag';
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
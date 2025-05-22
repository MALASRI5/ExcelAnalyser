import { Reminder } from '../types';

const STORAGE_KEY = 'smart-reminder-app-reminders';

export function getRemindersFromStorage(): Reminder[] {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) return [];
    return JSON.parse(storedData);
  } catch (error) {
    console.error('Error getting reminders from storage:', error);
    return [];
  }
}

export function saveRemindersToStorage(reminders: Reminder[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  } catch (error) {
    console.error('Error saving reminders to storage:', error);
  }
}
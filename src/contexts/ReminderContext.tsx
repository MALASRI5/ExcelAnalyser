import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Reminder, Priority, Category, DEFAULT_CATEGORY, DEFAULT_PRIORITY } from '../types';
import { getRemindersFromStorage, saveRemindersToStorage } from '../utils/storage';

interface ReminderContextType {
  reminders: Reminder[];
  getReminder: (id: string) => Reminder | undefined;
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>) => Reminder;
  updateReminder: (id: string, updates: Partial<Reminder>) => Reminder | null;
  deleteReminder: (id: string) => void;
  toggleReminderCompleted: (id: string) => void;
  filterReminders: (query: string, category?: Category | 'all', completed?: boolean) => Reminder[];
}

const ReminderContext = createContext<ReminderContextType | undefined>(undefined);

export function ReminderProvider({ children }: { children: React.ReactNode }) {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    const storedReminders = getRemindersFromStorage();
    setReminders(storedReminders);
  }, []);

  useEffect(() => {
    saveRemindersToStorage(reminders);
  }, [reminders]);

  const getReminder = (id: string) => {
    return reminders.find((reminder) => reminder.id === id);
  };

  const addReminder = (reminderData: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newReminder: Reminder = {
      id: uuidv4(),
      ...reminderData,
      category: reminderData.category || DEFAULT_CATEGORY,
      priority: reminderData.priority || DEFAULT_PRIORITY,
      createdAt: now,
      updatedAt: now,
    };

    setReminders((prev) => [...prev, newReminder]);
    return newReminder;
  };

  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    const reminderIndex = reminders.findIndex((r) => r.id === id);
    if (reminderIndex === -1) return null;

    const updatedReminder = {
      ...reminders[reminderIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updatedReminders = [...reminders];
    updatedReminders[reminderIndex] = updatedReminder;
    setReminders(updatedReminders);

    return updatedReminder;
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((reminder) => reminder.id !== id));
  };

  const toggleReminderCompleted = (id: string) => {
    const reminder = reminders.find((r) => r.id === id);
    if (reminder) {
      updateReminder(id, { completed: !reminder.completed });
    }
  };

  const filterReminders = (query: string, category: Category | 'all' = 'all', completed?: boolean) => {
    return reminders.filter((reminder) => {
      const matchesQuery = query
        ? reminder.title.toLowerCase().includes(query.toLowerCase()) ||
          reminder.description.toLowerCase().includes(query.toLowerCase())
        : true;
      
      const matchesCategory = category === 'all' || reminder.category === category;
      
      const matchesCompleted = completed === undefined ? true : reminder.completed === completed;
      
      return matchesQuery && matchesCategory && matchesCompleted;
    });
  };

  const value = {
    reminders,
    getReminder,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleReminderCompleted,
    filterReminders,
  };

  return <ReminderContext.Provider value={value}>{children}</ReminderContext.Provider>;
}

export function useReminders() {
  const context = useContext(ReminderContext);
  if (context === undefined) {
    throw new Error('useReminders must be used within a ReminderProvider');
  }
  return context;
}
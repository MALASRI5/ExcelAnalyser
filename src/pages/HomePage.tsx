import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import ReminderCard from '../components/reminders/ReminderCard';
import ReminderFilter from '../components/reminders/ReminderFilter';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import { useReminders } from '../contexts/ReminderContext';
import { Category } from '../types';

const HomePage = () => {
  const { filterReminders } = useReminders();
  const [searchParams] = useSearchParams();
  const [filteredReminders, setFilteredReminders] = useState(filterReminders(''));

  useEffect(() => {
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') as Category | 'all' || 'all';
    const completedParam = searchParams.get('completed');
    
    const completed = completedParam === 'true' 
      ? true 
      : completedParam === 'false' 
        ? false 
        : undefined;
    
    setFilteredReminders(filterReminders(query, category, completed));
  }, [searchParams, filterReminders]);

  const searchQuery = searchParams.get('q');

  return (
    <div>
      {searchQuery && (
        <div className="mb-6">
          <h1 className="text-xl font-medium mb-2">Search results for "{searchQuery}"</h1>
          <p className="text-neutral-500">
            Found {filteredReminders.length} reminder{filteredReminders.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
      
      <ReminderFilter />
      
      {filteredReminders.length > 0 ? (
        <div className="animate-fade-in">
          {filteredReminders.map((reminder) => (
            <ReminderCard key={reminder.id} reminder={reminder} />
          ))}
        </div>
      ) : (
        <EmptyState 
          title="No reminders found"
          description={
            searchQuery
              ? `No reminders match your search for "${searchQuery}"`
              : "You don't have any reminders yet. Create your first reminder to get started!"
          }
          actionLabel="Create Reminder"
          onAction={() => window.location.href = '/reminders/new'}
          icon={<PlusCircle className="w-16 h-16 text-neutral-300" />}
        />
      )}
    </div>
  );
};

export default HomePage;
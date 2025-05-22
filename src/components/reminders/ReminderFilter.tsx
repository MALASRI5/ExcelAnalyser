import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { CATEGORIES, Category } from '../../types';

const ReminderFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || 'all';
  const completed = searchParams.get('completed') === 'true';
  const showFilter = searchParams.get('showFilter') === 'true';

  const toggleFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('showFilter', (!showFilter).toString());
    setSearchParams(newParams);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', e.target.value);
    }
    setSearchParams(newParams);
  };

  const handleCompletedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value === 'all') {
      newParams.delete('completed');
    } else {
      newParams.set('completed', e.target.value === 'true' ? 'true' : 'false');
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    const newParams = new URLSearchParams();
    const query = searchParams.get('q');
    if (query) newParams.set('q', query);
    newParams.set('showFilter', 'true');
    setSearchParams(newParams);
  };

  const hasActiveFilters = category !== 'all' || searchParams.has('completed');

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Reminders</h2>
        
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={toggleFilter}
          className="flex items-center"
        >
          {showFilter ? (
            <>
              <X className="h-4 w-4 mr-1" />
              <span>Hide Filters</span>
            </>
          ) : (
            <>
              <Filter className="h-4 w-4 mr-1" />
              <span>Filter</span>
              {hasActiveFilters && <span className="ml-1 bg-primary-500 text-white rounded-full w-2 h-2"></span>}
            </>
          )}
        </Button>
      </div>
      
      {showFilter && (
        <div className="bg-white rounded-lg p-4 shadow-sm mb-4 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              value={category}
              onChange={handleCategoryChange}
              options={[
                { value: 'all', label: 'All Categories' },
                ...CATEGORIES.map(cat => ({ 
                  value: cat, 
                  label: cat.charAt(0).toUpperCase() + cat.slice(1) 
                }))
              ]}
            />
            
            <Select
              label="Status"
              value={completed === true ? 'true' : completed === false ? 'false' : 'all'}
              onChange={handleCompletedChange}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'false', label: 'Active' },
                { value: 'true', label: 'Completed' },
              ]}
            />
          </div>
          
          {hasActiveFilters && (
            <div className="flex justify-end mt-2">
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-800"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReminderFilter;
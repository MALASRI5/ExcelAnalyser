import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Plus, Clock, X, Search } from 'lucide-react';
import Button from '../ui/Button';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchVisible(false);
    }
  };

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
    if (!searchVisible) {
      setTimeout(() => document.getElementById('search-input')?.focus(), 100);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and desktop nav */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Clock className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-semibold text-neutral-900">Remind</span>
            </Link>
            <nav className="hidden md:ml-8 md:flex md:space-x-6">
              <Link to="/" className="text-neutral-600 hover:text-neutral-900 px-3 py-2 text-sm font-medium">All Reminders</Link>
              <Link to="/?completed=true" className="text-neutral-600 hover:text-neutral-900 px-3 py-2 text-sm font-medium">Completed</Link>
            </nav>
          </div>
          
          {/* Search and actions */}
          <div className="flex items-center">
            {/* Search on desktop */}
            <div className="hidden md:block relative mr-4">
              {searchVisible ? (
                <form onSubmit={handleSearch} className="animate-fade-in flex items-center">
                  <input
                    id="search-input"
                    type="text"
                    placeholder="Search reminders..."
                    className="form-input py-1.5"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button 
                    type="button" 
                    variant="secondary"
                    size="sm"
                    className="ml-2"
                    onClick={toggleSearch}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={toggleSearch}
                  className="flex items-center"
                >
                  <Search className="h-4 w-4 mr-1" />
                  <span>Search</span>
                </Button>
              )}
            </div>
            
            {/* New reminder button */}
            <Link to="/reminders/new">
              <Button variant="primary" className="flex items-center">
                <Plus className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">New Reminder</span>
                <span className="sm:hidden">New</span>
              </Button>
            </Link>
            
            {/* Mobile menu button */}
            <button
              className="ml-4 md:hidden rounded-md p-2 text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Mobile search */}
        <div className={`md:hidden py-2 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search reminders..."
              className="form-input py-1.5 flex-grow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              variant="primary"
              size="sm"
              className="ml-2"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
          
          <nav className="mt-3 space-y-1">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              All Reminders
            </Link>
            <Link 
              to="/?completed=true" 
              className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Completed
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
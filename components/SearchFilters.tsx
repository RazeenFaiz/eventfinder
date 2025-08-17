'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Search, Filter, X } from 'lucide-react';
import { EventCategory, EventFilters } from '@/types/event';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';

interface SearchFiltersProps {
  onFiltersChange: (filters: EventFilters) => void;
  eventCount?: number;
}

const categories: EventCategory[] = [
  'Tech', 'Conference', 'Workshop', 'Festival', 'Academic', 'Religious', 'Business', 'Sports'
];

const categoryColors = {
  Tech: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
  Conference: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
  Workshop: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
  Festival: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
  Academic: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
  Religious: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
  Business: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100',
  Sports: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
};

export function SearchFilters({ onFiltersChange, eventCount }: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFiltersChange({
        searchQuery,
        categories: selectedCategories
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategories, onFiltersChange]);

  const handleCategoryToggle = (category: EventCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
  };

  const hasActiveFilters = searchQuery.length > 0 || selectedCategories.length > 0;

  return (
    <Card className="p-4 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search events by title, description, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Categories
              {selectedCategories.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1 text-xs">
                  {selectedCategories.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Filter by Category</h4>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryToggle(category)}
                    />
                    <label
                      htmlFor={category}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Selected Categories */}
        {selectedCategories.map((category) => (
          <Badge
            key={category}
            variant="secondary"
            className={`${categoryColors[category]} cursor-pointer`}
            onClick={() => handleCategoryToggle(category)}
          >
            {category}
            <X className="h-3 w-3 ml-1" />
          </Badge>
        ))}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Results Count */}
      {eventCount !== undefined && (
        <p className="text-sm text-muted-foreground">
          {eventCount} event{eventCount !== 1 ? 's' : ''} found
          {hasActiveFilters && ' matching your search criteria'}
        </p>
      )}
    </Card>
  );
}
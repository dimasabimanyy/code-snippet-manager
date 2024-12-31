// src/components/Search/index.jsx
import React from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { LANGUAGES } from '../../utils/languages';

const Search = ({ filters, onFiltersChange }) => {
  return (
    <div className="space-y-3 mb-4">
      {/* Search input */}
      <div className="relative">
        <SearchIcon 
          size={18} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search snippets..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <select
          value={filters.language || ''}
          onChange={(e) => onFiltersChange({ 
            ...filters, 
            language: e.target.value || null 
          })}
          className="px-3 py-1 border dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
        >
          <option value="">All Languages</option>
          {LANGUAGES.map(lang => (
            <option key={lang.id} value={lang.id}>
              {lang.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Filter by tag"
          value={filters.tag || ''}
          onChange={(e) => onFiltersChange({ 
            ...filters, 
            tag: e.target.value 
          })}
          className="px-3 py-1 border dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
        />
      </div>
    </div>
  );
};

export default Search;
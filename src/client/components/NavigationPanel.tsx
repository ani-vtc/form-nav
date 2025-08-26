import { useState } from 'react';
import { FilterOptions } from '../types/database';

interface NavigationPanelProps {
  onFilterChange: (filters: FilterOptions) => void;
  onDownloadSelected: () => void;
  onDownloadAll: () => void;
  selectedCount: number;
  totalCount: number;
}

export function NavigationPanel({ 
  onFilterChange, 
  onDownloadSelected, 
  onDownloadAll, 
  selectedCount, 
  totalCount 
}: NavigationPanelProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    industry: '',
    dateFrom: '',
    dateTo: ''
  });

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterOptions = {
      search: '',
      industry: '',
      dateFrom: '',
      dateTo: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="navigation-panel">
      <div className="panel-header">
        <h2>Database Navigator</h2>
        <div className="entry-count">
          {selectedCount > 0 ? `${selectedCount} selected of ${totalCount}` : `${totalCount} entries`}
        </div>
      </div>

      <div className="filters-section">
        <h3>Filters</h3>
        
        <div className="filter-group">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            type="text"
            placeholder="Search by name, email, company..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="industry">Industry</label>
          <select
            id="industry"
            value={filters.industry}
            onChange={(e) => handleFilterChange('industry', e.target.value)}
          >
            <option value="">All Industries</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
            <option value="Education">Education</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Retail">Retail</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="dateFrom">Date From</label>
          <input
            id="dateFrom"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="dateTo">Date To</label>
          <input
            id="dateTo"
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
          />
        </div>

        <button className="clear-filters-btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      <div className="download-section">
        <h3>Export Options</h3>
        <button 
          className="download-btn primary"
          onClick={onDownloadAll}
        >
          Download All ({totalCount})
        </button>
        <button 
          className="download-btn secondary"
          onClick={onDownloadSelected}
          disabled={selectedCount === 0}
        >
          Download Selected ({selectedCount})
        </button>
      </div>
    </div>
  );
}
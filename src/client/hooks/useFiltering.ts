import { useMemo } from 'react';
import { DatabaseEntry, FilterOptions } from '../types/database';

export function useFiltering(data: DatabaseEntry[], filters: FilterOptions) {
  return useMemo(() => {
    return data.filter(entry => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const searchableFields = [
          entry.first_name,
          entry.last_name,
          entry.email,
          entry.company || '',
          entry.phone || ''
        ];
        
        const matchesSearch = searchableFields.some(field => 
          field.toLowerCase().includes(searchLower)
        );
        
        if (!matchesSearch) return false;
      }

      if (filters.industry && entry.industry !== filters.industry) {
        return false;
      }

      if (filters.dateFrom && entry.date_time) {
        const entryDate = new Date(entry.date_time);
        const fromDate = new Date(filters.dateFrom);
        if (entryDate < fromDate) return false;
      }

      if (filters.dateTo && entry.date_time) {
        const entryDate = new Date(entry.date_time);
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (entryDate > toDate) return false;
      }

      return true;
    });
  }, [data, filters]);
}
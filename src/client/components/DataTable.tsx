import { useState, useMemo } from 'react';
import { DatabaseEntry, SortField, SortDirection } from '../types/database';

interface DataTableProps {
  data: DatabaseEntry[];
  selectedIds: Set<number>;
  onSelectionChange: (selectedIds: Set<number>) => void;
}

export function DataTable({ data, selectedIds, onSelectionChange }: DataTableProps) {
  const [sortField, setSortField] = useState<SortField>('date_time');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return sortDirection === 'asc' ? 1 : -1;
      if (bVal === null) return sortDirection === 'asc' ? -1 : 1;
      
      let comparison = 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal);
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(new Set(data.map(entry => entry.id)));
    } else {
      onSelectionChange(new Set());
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    const newSelection = new Set(selectedIds);
    if (checked) {
      newSelection.add(id);
    } else {
      newSelection.delete(id);
    }
    onSelectionChange(newSelection);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString();
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const allSelected = data.length > 0 && selectedIds.size === data.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < data.length;

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th className="checkbox-column">
              <input
                type="checkbox"
                checked={allSelected}
                ref={input => {
                  if (input) input.indeterminate = someSelected;
                }}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </th>
            <th onClick={() => handleSort('date_time')} className="sortable">
              Date {getSortIcon('date_time')}
            </th>
            <th onClick={() => handleSort('first_name')} className="sortable">
              First Name {getSortIcon('first_name')}
            </th>
            <th onClick={() => handleSort('last_name')} className="sortable">
              Last Name {getSortIcon('last_name')}
            </th>
            <th onClick={() => handleSort('email')} className="sortable">
              Email {getSortIcon('email')}
            </th>
            <th onClick={() => handleSort('phone')} className="sortable">
              Phone {getSortIcon('phone')}
            </th>
            <th onClick={() => handleSort('company')} className="sortable">
              Company {getSortIcon('company')}
            </th>
            <th onClick={() => handleSort('industry')} className="sortable">
              Industry {getSortIcon('industry')}
            </th>
            <th>Comment</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map(entry => (
            <tr key={entry.id} className={selectedIds.has(entry.id) ? 'selected' : ''}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.has(entry.id)}
                  onChange={(e) => handleSelectOne(entry.id, e.target.checked)}
                />
              </td>
              <td>{formatDate(entry.date_time)}</td>
              <td>{entry.first_name}</td>
              <td>{entry.last_name}</td>
              <td>{entry.email}</td>
              <td>{entry.phone || ''}</td>
              <td>{entry.company || ''}</td>
              <td>{entry.industry || ''}</td>
              <td className="comment-cell">{entry.comment || ''}</td>
              <td className="reason-cell">{entry.reason || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {sortedData.length === 0 && (
        <div className="no-data">No entries found matching your filters.</div>
      )}
    </div>
  );
}
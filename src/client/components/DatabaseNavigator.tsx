import { useState, useEffect } from 'react';
import { DatabaseEntry, FilterOptions } from '../types/database';
import { NavigationPanel } from './NavigationPanel';
import { DataTable } from './DataTable';
import { DownloadModal } from './DownloadModal';
import { Pagination } from './Pagination';
import { useFiltering } from '../hooks/useFiltering';
import { apiService } from '../services/api';

const ENTRIES_PER_PAGE = 20;

interface DatabaseNavigatorProps {
  data?: DatabaseEntry[];
}

export function DatabaseNavigator({ data: initialData }: DatabaseNavigatorProps) {
  const [data, setData] = useState<DatabaseEntry[]>(initialData || []);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    industry: '',
    dateFrom: '',
    dateTo: ''
  });
  const [downloadModal, setDownloadModal] = useState<{
    isOpen: boolean;
    data: DatabaseEntry[];
    filename: string;
  }>({
    isOpen: false,
    data: [],
    filename: ''
  });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useFiltering(data, filters);
  const totalPages = Math.ceil(filteredData.length / ENTRIES_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ENTRIES_PER_PAGE,
    currentPage * ENTRIES_PER_PAGE
  );

  useEffect(() => {
    if (!initialData) {
      setLoading(true);
      apiService.fetchData()
        .then(setData)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [initialData]);

  const handleDownloadSelected = () => {
    const selectedData = filteredData.filter(entry => selectedIds.has(entry.id));
    setDownloadModal({
      isOpen: true,
      data: selectedData,
      filename: `selected_entries_${new Date(Date.now()).toISOString().split('T')[0]}`
    });
  };

  const handleDownloadAll = () => {
    setDownloadModal({
      isOpen: true,
      data: filteredData,
      filename: `all_entries_${new Date(Date.now()).toISOString().split('T')[0]}`
    });
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setSelectedIds(new Set());
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedIds(new Set());
  };

  const selectedCount = Array.from(selectedIds).filter(id => 
    paginatedData.some(entry => entry.id === id)
  ).length;

  if (loading) {
    return (
      <div className="database-navigator loading">
        <div className="loading-message">Loading database entries...</div>
      </div>
    );
  }

  return (
    <div className="database-navigator">
      <div className="navigator-sidebar">
        <NavigationPanel
          onFilterChange={handleFilterChange}
          onDownloadSelected={handleDownloadSelected}
          onDownloadAll={handleDownloadAll}
          selectedCount={selectedCount}
          totalCount={filteredData.length}
        />
      </div>
      
      <div className="navigator-main">
        <DataTable
          data={paginatedData}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalEntries={filteredData.length}
          entriesPerPage={ENTRIES_PER_PAGE}
        />
      </div>

      <DownloadModal
        isOpen={downloadModal.isOpen}
        onClose={() => setDownloadModal(prev => ({ ...prev, isOpen: false }))}
        data={downloadModal.data}
        filename={downloadModal.filename}
      />
    </div>
  );
}
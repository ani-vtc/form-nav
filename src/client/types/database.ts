export interface DatabaseEntry {
  id: number;
  date_time: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  industry: string | null;
  comment: string | null;
  reason: string | null;
}

export interface FilterOptions {
  search: string;
  industry: string;
  dateFrom: string;
  dateTo: string;
}

export type SortField = keyof DatabaseEntry;
export type SortDirection = 'asc' | 'desc';
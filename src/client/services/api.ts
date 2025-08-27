import { DatabaseEntry } from '../types/database';

export class ApiService {
  private baseUrl = '';

  async fetchData(): Promise<DatabaseEntry[]> {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(JSON.stringify(data));
      // Ensure we always return an array
      if (!Array.isArray(data)) {
        console.warn('API returned non-array data:', data);
        return [];
      }
      
      return data;
    } catch (error) {
      console.error('Failed to fetch data:', error);
      // Return empty array on error to prevent crashes
      return [];
    }
  }
}

export const apiService = new ApiService();
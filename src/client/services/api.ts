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
      return data;
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
import { HOSPITALS_DATA } from '../data/mockData';
import { storageService } from './storageService';

export const hospitalsService = {
  async getHospitals({ sortBy = 'distance', emergencyOnly = false, searchQuery = '' } = {}) {
    const settings = await storageService.getSettings();
    let hospitals = [...HOSPITALS_DATA];

    // Try fetching from backend if available
    try {
      const url = `${settings.backendUrl || 'http://10.0.2.2:3000'}/api/hospitals?sortBy=${sortBy}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000); // 2 sec timeout
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          hospitals = json.data;
        }
      }
    } catch {
      // Backend unavailable, fallback seamlessly to embedded hospitals
    }

    if (searchQuery && searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      hospitals = hospitals.filter(h => 
        h.name.toLowerCase().includes(q) || 
        h.address.toLowerCase().includes(q)
      );
    }

    if (emergencyOnly) {
      hospitals = hospitals.filter(h => h.emergencyAvailable);
    }

    if (sortBy === 'rating') {
      hospitals.sort((a, b) => b.rating - a.rating);
    } else {
      hospitals.sort((a, b) => a.distanceKm - b.distanceKm);
    }

    return hospitals;
  }
};

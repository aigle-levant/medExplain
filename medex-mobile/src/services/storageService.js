import AsyncStorage from '@react-native-async-storage/async-storage';
import { SAMPLE_PRESCRIPTIONS, SAMPLE_REPORTS } from '../data/mockData';

const KEYS = {
  SETTINGS: '@medex_settings',
  MEAL_TIMINGS: '@medex_meal_timings',
  REPORTS: '@medex_reports',
  PRESCRIPTIONS: '@medex_prescriptions',
  DOSE_HISTORY: '@medex_dose_history',
  CHECKUPS: '@medex_checkups',
};

const DEFAULT_SETTINGS = {
  groqApiKey: '',
  groqModel: 'openai/gpt-oss-20b',
  geminiApiKey: '',
  backendUrl: 'http://10.0.2.2:3000', // standard Android emulator host IP
  preferredLanguage: 'both', // 'en', 'ta', 'both'
  useDirectAi: true
};

const DEFAULT_MEAL_TIMINGS = {
  breakfastTime: '08:30',
  lunchTime: '13:00',
  dinnerTime: '20:30',
  timeZone: 'Asia/Kolkata'
};

export const storageService = {
  async getSettings() {
    try {
      const data = await AsyncStorage.getItem(KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  async saveSettings(settings) {
    try {
      const current = await this.getSettings();
      const updated = { ...current, ...settings };
      await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Error saving settings', e);
      return null;
    }
  },

  async getMealTimings() {
    try {
      const data = await AsyncStorage.getItem(KEYS.MEAL_TIMINGS);
      return data ? { ...DEFAULT_MEAL_TIMINGS, ...JSON.parse(data) } : DEFAULT_MEAL_TIMINGS;
    } catch {
      return DEFAULT_MEAL_TIMINGS;
    }
  },

  async saveMealTimings(timings) {
    try {
      const current = await this.getMealTimings();
      const updated = { ...current, ...timings };
      await AsyncStorage.setItem(KEYS.MEAL_TIMINGS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Error saving meal timings', e);
      return null;
    }
  },

  async getPrescriptions() {
    try {
      const data = await AsyncStorage.getItem(KEYS.PRESCRIPTIONS);
      if (data) return JSON.parse(data);
      // Initialize with sample prescription if first run
      await AsyncStorage.setItem(KEYS.PRESCRIPTIONS, JSON.stringify(SAMPLE_PRESCRIPTIONS));
      return SAMPLE_PRESCRIPTIONS;
    } catch {
      return SAMPLE_PRESCRIPTIONS;
    }
  },

  async savePrescription(prescription) {
    try {
      const list = await this.getPrescriptions();
      const updated = [prescription, ...list.filter(p => p.id !== prescription.id)];
      await AsyncStorage.setItem(KEYS.PRESCRIPTIONS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Error saving prescription', e);
      return [];
    }
  },

  async deletePrescription(id) {
    try {
      const list = await this.getPrescriptions();
      const updated = list.filter(p => p.id !== id);
      await AsyncStorage.setItem(KEYS.PRESCRIPTIONS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Error deleting prescription', e);
      return [];
    }
  },

  async getDoseHistory() {
    try {
      const data = await AsyncStorage.getItem(KEYS.DOSE_HISTORY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  async toggleDoseTaken(dateKey, doseId) {
    try {
      const history = await this.getDoseHistory();
      const dayDoses = history[dateKey] || {};
      dayDoses[doseId] = !dayDoses[doseId];
      history[dateKey] = dayDoses;
      await AsyncStorage.setItem(KEYS.DOSE_HISTORY, JSON.stringify(history));
      return history;
    } catch (e) {
      console.error('Error updating dose', e);
      return {};
    }
  },

  async getReports() {
    try {
      const data = await AsyncStorage.getItem(KEYS.REPORTS);
      if (data) return JSON.parse(data);
      await AsyncStorage.setItem(KEYS.REPORTS, JSON.stringify(SAMPLE_REPORTS));
      return SAMPLE_REPORTS;
    } catch {
      return SAMPLE_REPORTS;
    }
  },

  async saveReport(report) {
    try {
      const list = await this.getReports();
      const updated = [report, ...list.filter(r => r.id !== report.id)];
      await AsyncStorage.setItem(KEYS.REPORTS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Error saving report', e);
      return [];
    }
  },

  async getCheckups() {
    try {
      const data = await AsyncStorage.getItem(KEYS.CHECKUPS);
      if (data) return JSON.parse(data);
      const defaultCheckup = [
        {
          id: 'chk-1',
          doctorName: 'Dr. K. Rajesh, M.D.',
          clinicName: 'City Health Clinic, Chennai',
          date: '2026-11-02',
          time: '10:30 AM',
          notes: 'Review after 5 days with fever chart'
        }
      ];
      await AsyncStorage.setItem(KEYS.CHECKUPS, JSON.stringify(defaultCheckup));
      return defaultCheckup;
    } catch {
      return [];
    }
  },

  async saveCheckup(checkup) {
    try {
      const list = await this.getCheckups();
      const updated = [checkup, ...list.filter(c => c.id !== checkup.id)];
      await AsyncStorage.setItem(KEYS.CHECKUPS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Error saving checkup', e);
      return [];
    }
  }
};

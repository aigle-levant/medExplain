import AsyncStorage from '@react-native-async-storage/async-storage';
import { SAMPLE_PRESCRIPTIONS, SAMPLE_REPORTS } from '../data/mockData';

const KEYS = {
  SETTINGS: '@medex_settings',
  PROFILE: '@medex_user_profile',
  PREFERENCES: '@medex_user_preferences',
  MEAL_TIMINGS: '@medex_meal_timings',
  REPORTS: '@medex_reports',
  PRESCRIPTIONS: '@medex_prescriptions',
  DOSE_HISTORY: '@medex_dose_history',
  CHECKUPS: '@medex_checkups',
};

const DEFAULT_PROFILE = {
  name: 'Arun Kumar',
  email: 'arun.kumar@gmail.com',
  phone: '+91 98401 23456',
  bloodGroup: 'O+',
  age: '38',
  gender: 'Male',
  emergencyContactName: 'Kavitha (Spouse)',
  emergencyContactPhone: '+91 98401 65432'
};

const DEFAULT_PREFERENCES = {
  language: 'both', // 'en', 'ta', 'both'
  doseReminders: true,
  appointmentAlerts: true,
  soundVibration: true,
  darkMode: false,
  biometricLock: false,
  breakfastTime: '08:30',
  lunchTime: '13:00',
  dinnerTime: '20:30',
  timeZone: 'Asia/Kolkata'
};

const DEFAULT_SETTINGS = {
  backendUrl: 'http://10.0.2.2:3000',
  preferredLanguage: 'both'
};

export const storageService = {
  async getUserProfile() {
    try {
      const data = await AsyncStorage.getItem(KEYS.PROFILE);
      return data ? { ...DEFAULT_PROFILE, ...JSON.parse(data) } : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  async saveUserProfile(profile) {
    try {
      const current = await this.getUserProfile();
      const updated = { ...current, ...profile };
      await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Error saving user profile', e);
      return null;
    }
  },

  async getUserPreferences() {
    try {
      const data = await AsyncStorage.getItem(KEYS.PREFERENCES);
      return data ? { ...DEFAULT_PREFERENCES, ...JSON.parse(data) } : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  },

  async saveUserPreferences(prefs) {
    try {
      const current = await this.getUserPreferences();
      const updated = { ...current, ...prefs };
      await AsyncStorage.setItem(KEYS.PREFERENCES, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Error saving user preferences', e);
      return null;
    }
  },

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
      const prefs = await this.getUserPreferences();
      return {
        breakfastTime: prefs.breakfastTime || '08:30',
        lunchTime: prefs.lunchTime || '13:00',
        dinnerTime: prefs.dinnerTime || '20:30',
        timeZone: prefs.timeZone || 'Asia/Kolkata'
      };
    } catch {
      return {
        breakfastTime: '08:30',
        lunchTime: '13:00',
        dinnerTime: '20:30',
        timeZone: 'Asia/Kolkata'
      };
    }
  },

  async saveMealTimings(timings) {
    return this.saveUserPreferences(timings);
  },

  async getPrescriptions() {
    try {
      const data = await AsyncStorage.getItem(KEYS.PRESCRIPTIONS);
      if (data) return JSON.parse(data);
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

  async clearReportsAndHistory() {
    try {
      await AsyncStorage.removeItem(KEYS.REPORTS);
      await AsyncStorage.removeItem(KEYS.DOSE_HISTORY);
      return true;
    } catch (e) {
      console.error('Error clearing data', e);
      return false;
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

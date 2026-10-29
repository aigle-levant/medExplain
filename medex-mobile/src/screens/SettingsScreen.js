import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../theme/colors';
import { Header } from '../components/Header';
import { storageService } from '../services/storageService';

// ──────────────────────────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────────────────────────

const SectionCard = ({ icon, iconColor, title, children }) => (
  <View style={styles.card}>
    <View style={styles.cardTitleRow}>
      <Ionicons name={icon} size={18} color={iconColor || colors.primary} />
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

const FieldLabel = ({ label }) => (
  <Text style={styles.inputLabel}>{label}</Text>
);

const SettingRow = ({ icon, label, value, onValueChange, disabled }) => (
  <View style={styles.toggleRow}>
    <View style={styles.toggleLeft}>
      {icon && <Ionicons name={icon} size={16} color={colors.textSecondary} style={{ marginRight: 8 }} />}
      <Text style={styles.toggleLabel}>{label}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{ false: colors.border, true: colors.primaryLight }}
      thumbColor={value ? colors.primary : '#ccc'}
    />
  </View>
);

const LangChip = ({ label, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.langChip, selected && styles.langChipActive]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={[styles.langChipText, selected && styles.langChipTextActive]}>{label}</Text>
  </TouchableOpacity>
);

// ──────────────────────────────────────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────────────────────────────────────

export const SettingsScreen = () => {
  // Profile
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  // Emergency Contact
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  // Notifications
  const [doseReminders, setDoseReminders] = useState(true);
  const [appointmentAlerts, setAppointmentAlerts] = useState(true);
  const [soundVibration, setSoundVibration] = useState(true);

  // Appearance
  const [language, setLanguage] = useState('both');
  const [darkMode, setDarkMode] = useState(false);

  // Privacy
  const [biometricLock, setBiometricLock] = useState(false);

  // Meal timings
  const [breakfast, setBreakfast] = useState('08:30');
  const [lunch, setLunch] = useState('13:00');
  const [dinner, setDinner] = useState('20:30');

  // ────────────────────────────────
  // Load persisted data on mount
  // ────────────────────────────────
  const loadData = useCallback(async () => {
    const profile = await storageService.getUserProfile();
    setName(profile.name || '');
    setEmail(profile.email || '');
    setPhone(profile.phone || '');
    setBloodGroup(profile.bloodGroup || '');
    setAge(profile.age || '');
    setGender(profile.gender || '');
    setEmergencyName(profile.emergencyContactName || '');
    setEmergencyPhone(profile.emergencyContactPhone || '');

    const prefs = await storageService.getUserPreferences();
    setDoseReminders(prefs.doseReminders ?? true);
    setAppointmentAlerts(prefs.appointmentAlerts ?? true);
    setSoundVibration(prefs.soundVibration ?? true);
    setLanguage(prefs.language || 'both');
    setDarkMode(prefs.darkMode ?? false);
    setBiometricLock(prefs.biometricLock ?? false);
    setBreakfast(prefs.breakfastTime || '08:30');
    setLunch(prefs.lunchTime || '13:00');
    setDinner(prefs.dinnerTime || '20:30');
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ────────────────────────────────
  // Save
  // ────────────────────────────────
  const handleSave = async () => {
    await storageService.saveUserProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      bloodGroup: bloodGroup.trim(),
      age: age.trim(),
      gender: gender.trim(),
      emergencyContactName: emergencyName.trim(),
      emergencyContactPhone: emergencyPhone.trim(),
    });

    await storageService.saveUserPreferences({
      doseReminders,
      appointmentAlerts,
      soundVibration,
      language,
      darkMode,
      biometricLock,
      breakfastTime: breakfast.trim(),
      lunchTime: lunch.trim(),
      dinnerTime: dinner.trim(),
    });

    Alert.alert('Saved', 'Your profile and preferences have been updated.', [{ text: 'OK' }]);
  };

  // ────────────────────────────────
  // Clear health data
  // ────────────────────────────────
  const handleClearData = () => {
    Alert.alert(
      'Clear Health Data',
      'This will permanently delete all saved reports and dose history. Your profile and preferences will be kept. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            await storageService.clearReportsAndHistory();
            Alert.alert('Done', 'Health data cleared successfully.');
          },
        },
      ]
    );
  };

  // ────────────────────────────────
  // Render
  // ────────────────────────────────
  return (
    <View style={styles.container}>
      <Header
        title="Settings"
        subtitle="Profile, Notifications & Preferences"
        icon="settings"
      />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>

        {/* ── Profile ── */}
        <SectionCard icon="person-circle-outline" title="My Profile">
          <FieldLabel label="Full Name" />
          <TextInput
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
          />

          <FieldLabel label="Email Address" />
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor={colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <FieldLabel label="Phone Number" />
          <TextInput
            style={styles.input}
            placeholder="+91 XXXXX XXXXX"
            placeholderTextColor={colors.textMuted}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <View style={styles.inlineRow}>
            <View style={styles.inlineHalf}>
              <FieldLabel label="Blood Group" />
              <TextInput
                style={styles.input}
                placeholder="e.g. O+"
                placeholderTextColor={colors.textMuted}
                value={bloodGroup}
                onChangeText={setBloodGroup}
              />
            </View>
            <View style={[styles.inlineHalf, { marginLeft: 8 }]}>
              <FieldLabel label="Age" />
              <TextInput
                style={styles.input}
                placeholder="e.g. 35"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
                value={age}
                onChangeText={setAge}
              />
            </View>
          </View>

          <FieldLabel label="Gender" />
          <View style={styles.genderRow}>
            {['Male', 'Female', 'Other'].map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.langChip, gender === g && styles.langChipActive]}
                onPress={() => setGender(g)}
                activeOpacity={0.7}
              >
                <Text style={[styles.langChipText, gender === g && styles.langChipTextActive]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </SectionCard>

        {/* ── Emergency Contact ── */}
        <SectionCard icon="alert-circle-outline" iconColor={colors.danger} title="Emergency Contact">
          <Text style={styles.cardSub}>This contact will be shown during emergency SOS situations.</Text>

          <FieldLabel label="Contact Name" />
          <TextInput
            style={styles.input}
            placeholder="e.g. Kavitha (Spouse)"
            placeholderTextColor={colors.textMuted}
            value={emergencyName}
            onChangeText={setEmergencyName}
          />

          <FieldLabel label="Contact Phone" />
          <TextInput
            style={styles.input}
            placeholder="+91 XXXXX XXXXX"
            placeholderTextColor={colors.textMuted}
            keyboardType="phone-pad"
            value={emergencyPhone}
            onChangeText={setEmergencyPhone}
          />
        </SectionCard>

        {/* ── Notifications ── */}
        <SectionCard icon="notifications-outline" iconColor={colors.secondary} title="Notifications & Alerts">
          <SettingRow
            icon="medkit-outline"
            label="Dose Reminders"
            value={doseReminders}
            onValueChange={setDoseReminders}
          />
          <SettingRow
            icon="calendar-outline"
            label="Appointment Alerts"
            value={appointmentAlerts}
            onValueChange={setAppointmentAlerts}
          />
          <SettingRow
            icon="volume-high-outline"
            label="Sound & Vibration"
            value={soundVibration}
            onValueChange={setSoundVibration}
          />
        </SectionCard>

        {/* ── Meal Timings ── */}
        <SectionCard icon="time-outline" iconColor={colors.secondary} title="Meal Timings for Dose Alarms">
          <Text style={styles.cardSub}>Alarms trigger before / after meals based on these times.</Text>
          <View style={styles.mealRow}>
            <View style={{ flex: 1, marginRight: 4 }}>
              <FieldLabel label="Breakfast" />
              <TextInput
                style={styles.input}
                placeholder="08:30"
                placeholderTextColor={colors.textMuted}
                value={breakfast}
                onChangeText={setBreakfast}
              />
            </View>
            <View style={{ flex: 1, marginHorizontal: 4 }}>
              <FieldLabel label="Lunch" />
              <TextInput
                style={styles.input}
                placeholder="13:00"
                placeholderTextColor={colors.textMuted}
                value={lunch}
                onChangeText={setLunch}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 4 }}>
              <FieldLabel label="Dinner" />
              <TextInput
                style={styles.input}
                placeholder="20:30"
                placeholderTextColor={colors.textMuted}
                value={dinner}
                onChangeText={setDinner}
              />
            </View>
          </View>
        </SectionCard>

        {/* ── Appearance ── */}
        <SectionCard icon="color-palette-outline" iconColor={colors.primaryDark} title="Appearance & Language">
          <FieldLabel label="Display Language" />
          <View style={styles.langRow}>
            <LangChip label="English" selected={language === 'en'} onPress={() => setLanguage('en')} />
            <LangChip label="தமிழ்" selected={language === 'ta'} onPress={() => setLanguage('ta')} />
            <LangChip label="Bilingual" selected={language === 'both'} onPress={() => setLanguage('both')} />
          </View>

          <SettingRow
            icon="moon-outline"
            label="Dark Mode"
            value={darkMode}
            onValueChange={setDarkMode}
          />
        </SectionCard>

        {/* ── Privacy & Security ── */}
        <SectionCard icon="shield-checkmark-outline" iconColor={colors.primaryDark} title="Privacy & Security">
          <SettingRow
            icon="finger-print-outline"
            label="Biometric Lock"
            value={biometricLock}
            onValueChange={setBiometricLock}
          />

          <TouchableOpacity style={styles.dangerRow} onPress={handleClearData} activeOpacity={0.7}>
            <Ionicons name="trash-outline" size={16} color={colors.danger} />
            <Text style={styles.dangerText}>Clear Health Data (Reports & Dose History)</Text>
          </TouchableOpacity>
        </SectionCard>

        {/* ── About ── */}
        <SectionCard icon="information-circle-outline" title="About">
          <TouchableOpacity
            style={styles.aboutRow}
            onPress={() => Linking.openURL('https://github.com/durvish47/medExplain')}
            activeOpacity={0.7}
          >
            <Ionicons name="logo-github" size={16} color={colors.textSecondary} />
            <Text style={styles.aboutRowText}>Source Code on GitHub</Text>
            <Ionicons name="open-outline" size={14} color={colors.textMuted} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.aboutRow} activeOpacity={0.7}>
            <Ionicons name="document-text-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.aboutRowText}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.textMuted} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.aboutRow} activeOpacity={0.7}>
            <Ionicons name="lock-closed-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.aboutRowText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.textMuted} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        </SectionCard>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
          <Ionicons name="checkmark-circle" size={20} color={colors.textWhite} />
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>

        {/* App Info Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>MedEx v1.0.0</Text>
          <Text style={styles.footerSub}>MedExplain · MedRemind · MedLexicon · Healthcare Finder</Text>
          <Text style={styles.footerSub}>Made with ❤️ for better health</Text>
        </View>

      </ScrollView>
    </View>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMuted,
  },
  content: { flex: 1 },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: 48,
  },

  // Card
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginLeft: 8,
  },
  cardSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },

  // Inputs
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 4,
    marginTop: spacing.xs,
  },
  input: {
    backgroundColor: colors.bgHighlight,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    fontSize: 13,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xs,
  },
  inlineRow: {
    flexDirection: 'row',
  },
  inlineHalf: {
    flex: 1,
  },

  // Gender / Lang chips
  genderRow: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: spacing.xs,
  },
  langRow: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: spacing.sm,
  },
  langChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.bgHighlight,
    alignItems: 'center',
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  langChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  langChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  langChipTextActive: {
    color: colors.textWhite,
    fontWeight: '700',
  },

  // Toggles
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 14,
    color: colors.textPrimary,
  },

  // Meal timings
  mealRow: {
    flexDirection: 'row',
  },

  // Danger action
  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  dangerText: {
    fontSize: 13,
    color: colors.danger,
    marginLeft: 8,
    fontWeight: '600',
  },

  // About rows
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  aboutRowText: {
    fontSize: 13,
    color: colors.textPrimary,
    marginLeft: 10,
  },

  // Save button
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textWhite,
    marginLeft: 8,
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  footerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  footerSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 3,
    textAlign: 'center',
  },
});

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { colors, spacing, borderRadius } from '../theme/colors';
import { Header } from '../components/Header';
import { storageService } from '../services/storageService';
import { Ionicons } from '@expo/vector-icons';

export const SettingsScreen = () => {
  const [groqKey, setGroqKey] = useState('');
  const [groqModel, setGroqModel] = useState('openai/gpt-oss-20b');
  const [geminiKey, setGeminiKey] = useState('');
  const [backendUrl, setBackendUrl] = useState('http://10.0.2.2:3000');
  const [language, setLanguage] = useState('both');
  
  // Meal timings
  const [breakfast, setBreakfast] = useState('08:30');
  const [lunch, setLunch] = useState('13:00');
  const [dinner, setDinner] = useState('20:30');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const s = await storageService.getSettings();
    if (s.groqApiKey) setGroqKey(s.groqApiKey);
    if (s.groqModel) setGroqModel(s.groqModel);
    if (s.geminiApiKey) setGeminiKey(s.geminiApiKey);
    if (s.backendUrl) setBackendUrl(s.backendUrl);
    if (s.preferredLanguage) setLanguage(s.preferredLanguage);

    const m = await storageService.getMealTimings();
    if (m.breakfastTime) setBreakfast(m.breakfastTime);
    if (m.lunchTime) setLunch(m.lunchTime);
    if (m.dinnerTime) setDinner(m.dinnerTime);
  };

  const handleSave = async () => {
    await storageService.saveSettings({
      groqApiKey: groqKey.trim(),
      groqModel: groqModel.trim(),
      geminiApiKey: geminiKey.trim(),
      backendUrl: backendUrl.trim(),
      preferredLanguage: language
    });

    await storageService.saveMealTimings({
      breakfastTime: breakfast.trim(),
      lunchTime: lunch.trim(),
      dinnerTime: dinner.trim()
    });

    Alert.alert('Settings Saved', 'Your configuration and meal timings have been updated.');
  };

  const handleTestConnection = async () => {
    try {
      const res = await fetch(`${backendUrl}/health`);
      if (res.ok) {
        const json = await res.json();
        Alert.alert('Connection Successful', `Backend status: ${json.status || 'OK'}`);
      } else {
        Alert.alert('Connection Failed', `Server returned status ${res.status}`);
      }
    } catch (e) {
      Alert.alert('Offline / Direct Mode', `Could not reach ${backendUrl}. The mobile app will use direct AI and offline datasets.`);
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Settings" 
        subtitle="AI Keys, Meal Timings & Preferences"
        icon="settings"
      />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Language Preference */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Default Display Language</Text>
          <Text style={styles.cardSub}>Select language for report summaries & medicine details</Text>
          
          <View style={styles.langRow}>
            <TouchableOpacity 
              style={[styles.langChip, language === 'en' && styles.langChipActive]}
              onPress={() => setLanguage('en')}
            >
              <Text style={[styles.langChipText, language === 'en' && styles.langChipTextActive]}>English Only</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.langChip, language === 'ta' && styles.langChipActive]}
              onPress={() => setLanguage('ta')}
            >
              <Text style={[styles.langChipText, language === 'ta' && styles.langChipTextActive]}>தமிழ் (Tamil)</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.langChip, language === 'both' && styles.langChipActive]}
              onPress={() => setLanguage('both')}
            >
              <Text style={[styles.langChipText, language === 'both' && styles.langChipTextActive]}>Bilingual (Both)</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Provider Configuration */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="hardware-chip-outline" size={18} color={colors.primary} />
            <Text style={styles.cardTitle}>AI Engine Settings</Text>
          </View>
          
          <Text style={styles.inputLabel}>Groq API Key</Text>
          <TextInput
            style={styles.input}
            placeholder="gsk_..."
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            value={groqKey}
            onChangeText={setGroqKey}
          />

          <Text style={styles.inputLabel}>Groq Model</Text>
          <TextInput
            style={styles.input}
            placeholder="openai/gpt-oss-20b"
            placeholderTextColor={colors.textMuted}
            value={groqModel}
            onChangeText={setGroqModel}
          />

          <Text style={styles.inputLabel}>Gemini Vision API Key (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="AIzaSy..."
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            value={geminiKey}
            onChangeText={setGeminiKey}
          />
        </View>

        {/* Meal Timings Configuration */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="time-outline" size={18} color={colors.secondary} />
            <Text style={styles.cardTitle}>Daily Meal Timings for Alarms</Text>
          </View>
          <Text style={styles.cardSub}>Alarms trigger Before/After meals according to these times:</Text>

          <View style={styles.mealInputsRow}>
            <View style={{ flex: 1, marginRight: 4 }}>
              <Text style={styles.inputLabel}>Breakfast</Text>
              <TextInput
                style={styles.input}
                placeholder="08:30"
                placeholderTextColor={colors.textMuted}
                value={breakfast}
                onChangeText={setBreakfast}
              />
            </View>
            <View style={{ flex: 1, marginHorizontal: 4 }}>
              <Text style={styles.inputLabel}>Lunch</Text>
              <TextInput
                style={styles.input}
                placeholder="13:00"
                placeholderTextColor={colors.textMuted}
                value={lunch}
                onChangeText={setLunch}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 4 }}>
              <Text style={styles.inputLabel}>Dinner</Text>
              <TextInput
                style={styles.input}
                placeholder="20:30"
                placeholderTextColor={colors.textMuted}
                value={dinner}
                onChangeText={setDinner}
              />
            </View>
          </View>
        </View>

        {/* Backend Server Sync */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="server-outline" size={18} color={colors.primaryDark} />
            <Text style={styles.cardTitle}>Backend Server Connection</Text>
          </View>
          <Text style={styles.cardSub}>Default for Android emulator is http://10.0.2.2:3000</Text>

          <TextInput
            style={styles.input}
            placeholder="http://10.0.2.2:3000"
            placeholderTextColor={colors.textMuted}
            value={backendUrl}
            onChangeText={setBackendUrl}
          />

          <TouchableOpacity style={styles.testBtn} onPress={handleTestConnection}>
            <Ionicons name="radio-outline" size={16} color={colors.primary} />
            <Text style={styles.testBtnText}>Test Server Connection</Text>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
          <Ionicons name="save" size={18} color={colors.textWhite} />
          <Text style={styles.saveBtnText}>Save All Settings</Text>
        </TouchableOpacity>

        <View style={styles.appInfoBox}>
          <Text style={styles.appInfoText}>MedEx Mobile v1.0.0 (Unified React Native Edition)</Text>
          <Text style={styles.appInfoSub}>MedExplain • MedRemind • MedLexicon • Healthcare Finder</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMuted
  },
  content: {
    flex: 1
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: 40
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginLeft: 6
  },
  cardSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.sm
  },
  langRow: {
    flexDirection: 'row',
    marginTop: spacing.xs
  },
  langChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.bgHighlight,
    alignItems: 'center',
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: colors.border
  },
  langChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  langChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary
  },
  langChipTextActive: {
    color: colors.textWhite,
    fontWeight: '700'
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 4,
    marginTop: spacing.xs
  },
  input: {
    backgroundColor: colors.bgHighlight,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    fontSize: 13,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xs
  },
  mealInputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  testBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    paddingVertical: 8,
    borderRadius: borderRadius.sm,
    marginTop: spacing.xs
  },
  testBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
    marginLeft: 6
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textWhite,
    marginLeft: 6
  },
  appInfoBox: {
    alignItems: 'center',
    marginTop: spacing.lg
  },
  appInfoText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary
  },
  appInfoSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2
  }
});

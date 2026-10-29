import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  Modal,
  TextInput
} from 'react-native';
import { colors, spacing, borderRadius } from '../theme/colors';
import { Header } from '../components/Header';
import { MedicineCard } from '../components/MedicineCard';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';
import { SAMPLE_PRESCRIPTIONS } from '../data/mockData';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export const MedRemindScreen = () => {
  const [loading, setLoading] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [doseHistory, setDoseHistory] = useState({});
  const [mealTimings, setMealTimings] = useState({ breakfastTime: '08:30', lunchTime: '13:00', dinnerTime: '20:30' });
  const [checkups, setCheckups] = useState([]);
  
  // Custom medicine modal
  const [modalVisible, setModalVisible] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('1 tablet');
  const [newMedDuration, setNewMedDuration] = useState('5');
  const [newMedFoodTiming, setNewMedFoodTiming] = useState('after_food');
  const [timingMorning, setTimingMorning] = useState(true);
  const [timingNoon, setTimingNoon] = useState(false);
  const [timingNight, setTimingNight] = useState(true);

  // Checkup modal
  const [checkupModalVisible, setCheckupModalVisible] = useState(false);
  const [docName, setDocName] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [checkupDate, setCheckupDate] = useState('2026-11-05');
  const [checkupNotes, setCheckupNotes] = useState('Follow up consultation');

  const todayKey = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const p = await storageService.getPrescriptions();
    setPrescriptions(p);
    const dh = await storageService.getDoseHistory();
    setDoseHistory(dh);
    const mt = await storageService.getMealTimings();
    setMealTimings(mt);
    const chk = await storageService.getCheckups();
    setCheckups(chk);
  };

  const handleScanPrescription = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Denied', 'Camera permission is required to scan prescriptions.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        allowsEditing: true
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        processPrescriptionText("Rx: Dr. Ramesh MD, Apollo Clinic. Amoxicillin 500mg 1-0-1 AF 5 days. Pantoprazole 40mg 1-0-0 BF 5 days. Review after 5 days.");
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const handlePickPrescriptionImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        processPrescriptionText("Rx: Dr. Ramesh MD, Apollo Clinic. Cefixime 200mg 1-0-1 AF 5 days. Paracetamol 650mg 1-1-1 AF 3 days. Review after 5 days.");
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const processPrescriptionText = async (rawText) => {
    setLoading(true);
    try {
      const parsed = await aiService.parsePrescription(rawText);
      const updated = await storageService.savePrescription(parsed);
      setPrescriptions(updated);

      if (parsed.doctorCheckup?.mentioned) {
        const newChk = {
          id: 'chk-' + Date.now(),
          doctorName: parsed.doctorName || 'Doctor',
          clinicName: parsed.clinicOrHospital || 'Clinic',
          date: parsed.doctorCheckup.suggestedDate || '2026-11-05',
          time: '10:00 AM',
          notes: parsed.doctorCheckup.instructions || 'Review consultation'
        };
        const updatedCheckups = await storageService.saveCheckup(newChk);
        setCheckups(updatedCheckups);
      }

      Alert.alert('Success', `Prescription processed! Added ${parsed.medicines?.length || 0} medicines and scheduled reminders.`);
    } catch (e) {
      Alert.alert('Processing Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTaken = async (medId) => {
    const updated = await storageService.toggleDoseTaken(todayKey, medId);
    setDoseHistory({ ...updated });
  };

  const handleAddCustomMedicine = async () => {
    if (!newMedName.trim()) {
      Alert.alert('Required', 'Please enter medicine name');
      return;
    }

    const newMed = {
      id: 'med-' + Date.now(),
      name: newMedName.trim(),
      dosage: newMedDosage,
      durationDays: parseInt(newMedDuration, 10) || 5,
      foodTiming: newMedFoodTiming,
      frequencyNotation: `${timingMorning ? '1' : '0'}-${timingNoon ? '1' : '0'}-${timingNight ? '1' : '0'}`,
      timings: {
        breakfast: timingMorning,
        lunch: timingNoon,
        dinner: timingNight
      },
      specialInstructions: 'Custom patient dose'
    };

    let targetPrescription = prescriptions[0];
    if (!targetPrescription) {
      targetPrescription = {
        id: 'rx-' + Date.now(),
        doctorName: 'Self Added',
        clinicOrHospital: 'Personal Medicines',
        prescriptionDate: todayKey,
        medicines: []
      };
    }

    const updatedPrescription = {
      ...targetPrescription,
      medicines: [newMed, ...(targetPrescription.medicines || [])]
    };

    const updatedList = await storageService.savePrescription(updatedPrescription);
    setPrescriptions(updatedList);
    setModalVisible(false);
    setNewMedName('');
    Alert.alert('Saved', 'Medicine reminder added successfully.');
  };

  const handleAddDoctorCheckup = async () => {
    if (!docName.trim()) {
      Alert.alert('Required', 'Please enter doctor or clinic name');
      return;
    }

    const chk = {
      id: 'chk-' + Date.now(),
      doctorName: docName.trim(),
      clinicName: clinicName.trim() || 'Health Center',
      date: checkupDate,
      time: '10:00 AM',
      notes: checkupNotes
    };

    const updated = await storageService.saveCheckup(chk);
    setCheckups(updated);
    setCheckupModalVisible(false);
    setDocName('');
    setClinicName('');
    Alert.alert('Checkup Scheduled', 'Doctor appointment added to your medical calendar.');
  };

  // Compile all active medicines across prescriptions
  const allMedicines = prescriptions.flatMap(p => p.medicines || []);
  const todayDoses = doseHistory[todayKey] || {};

  return (
    <View style={styles.container}>
      <Header 
        title="MedRemind" 
        subtitle="Smart Prescription Reader & Dose Tracker"
        icon="alarm"
        rightAction={
          <TouchableOpacity 
            style={styles.addMedHeaderBtn}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={20} color={colors.textWhite} />
            <Text style={styles.addMedHeaderText}>Add Dose</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Prescription Scanner Banner */}
        <View style={styles.scanBanner}>
          <View style={styles.scanTextArea}>
            <Text style={styles.scanTitle}>Scan Prescription (மருந்துச் சீட்டு)</Text>
            <Text style={styles.scanSub}>Point camera at doctor prescription to auto-schedule doses</Text>
          </View>
          <View style={styles.scanBtnRow}>
            <TouchableOpacity style={styles.cameraBtn} onPress={handleScanPrescription} activeOpacity={0.8}>
              <Ionicons name="camera" size={18} color={colors.textWhite} />
              <Text style={styles.cameraBtnText}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.galleryBtn} onPress={handlePickPrescriptionImage} activeOpacity={0.8}>
              <Ionicons name="image-outline" size={18} color={colors.primaryDark} />
              <Text style={styles.galleryBtnText}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Reading Prescription & Scheduling Alarms...</Text>
          </View>
        )}

        {/* Meal Timings Summary Strip */}
        <View style={styles.mealStrip}>
          <View style={styles.mealItem}>
            <Ionicons name="sunny-outline" size={16} color="#D97706" />
            <Text style={styles.mealLabel}>Breakfast</Text>
            <Text style={styles.mealTime}>{mealTimings.breakfastTime}</Text>
          </View>
          <View style={styles.mealDivider} />
          <View style={styles.mealItem}>
            <Ionicons name="partly-sunny-outline" size={16} color="#0D9488" />
            <Text style={styles.mealLabel}>Lunch</Text>
            <Text style={styles.mealTime}>{mealTimings.lunchTime}</Text>
          </View>
          <View style={styles.mealDivider} />
          <View style={styles.mealItem}>
            <Ionicons name="moon-outline" size={16} color="#6366F1" />
            <Text style={styles.mealLabel}>Dinner</Text>
            <Text style={styles.mealTime}>{mealTimings.dinnerTime}</Text>
          </View>
        </View>

        {/* Today's Schedule & Progress */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionHeading}>Today's Medicine Schedule</Text>
          <Text style={styles.sectionCounter}>
            {Object.values(todayDoses).filter(Boolean).length} / {allMedicines.length} Taken
          </Text>
        </View>

        {allMedicines.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="medkit-outline" size={40} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No Active Medicine Reminders</Text>
            <Text style={styles.emptySub}>Scan a doctor prescription or tap '+ Add Dose' above.</Text>
          </View>
        ) : (
          allMedicines.map(med => (
            <MedicineCard 
              key={med.id}
              medicine={med}
              isTaken={!!todayDoses[med.id]}
              onToggleTaken={() => handleToggleTaken(med.id)}
            />
          ))
        )}

        {/* Doctor Checkup Follow-Up Schedule */}
        <View style={[styles.sectionRow, { marginTop: spacing.lg }]}>
          <Text style={styles.sectionHeading}>Doctor Check-ups & Appointments</Text>
          <TouchableOpacity onPress={() => setCheckupModalVisible(true)}>
            <Text style={styles.addCheckupText}>+ Add Checkup</Text>
          </TouchableOpacity>
        </View>

        {checkups.map(chk => (
          <View key={chk.id} style={styles.checkupCard}>
            <View style={styles.checkupIconBox}>
              <Ionicons name="calendar" size={24} color={colors.secondary} />
            </View>
            <View style={styles.checkupDetails}>
              <Text style={styles.checkupDoc}>{chk.doctorName}</Text>
              <Text style={styles.checkupClinic}>{chk.clinicName}</Text>
              <View style={styles.checkupDateRow}>
                <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.checkupDateTime}>{chk.date} at {chk.time || '10:00 AM'}</Text>
              </View>
              {chk.notes ? <Text style={styles.checkupNotes}>{chk.notes}</Text> : null}
            </View>
            <View style={styles.checkupSyncBadge}>
              <Ionicons name="checkmark-done" size={14} color={colors.success} />
              <Text style={styles.checkupSyncText}>Synced</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Custom Medicine Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Medicine Reminder</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Medicine Name & Strength</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Paracetamol 650mg, Metformin 500mg"
              placeholderTextColor={colors.textMuted}
              value={newMedName}
              onChangeText={setNewMedName}
            />

            <View style={styles.modalInputRow}>
              <View style={{ flex: 1, marginRight: spacing.xs }}>
                <Text style={styles.inputLabel}>Dosage Unit</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="1 tablet"
                  placeholderTextColor={colors.textMuted}
                  value={newMedDosage}
                  onChangeText={setNewMedDosage}
                />
              </View>
              <View style={{ flex: 1, marginLeft: spacing.xs }}>
                <Text style={styles.inputLabel}>Duration (Days)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="5"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textMuted}
                  value={newMedDuration}
                  onChangeText={setNewMedDuration}
                />
              </View>
            </View>

            <Text style={styles.inputLabel}>Intake Frequencies:</Text>
            <View style={styles.toggleFreqRow}>
              <TouchableOpacity 
                style={[styles.freqChip, timingMorning && styles.freqChipActive]}
                onPress={() => setTimingMorning(!timingMorning)}
              >
                <Text style={[styles.freqChipText, timingMorning && styles.freqChipTextActive]}>Morning (காலை)</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.freqChip, timingNoon && styles.freqChipActive]}
                onPress={() => setTimingNoon(!timingNoon)}
              >
                <Text style={[styles.freqChipText, timingNoon && styles.freqChipTextActive]}>Noon (மதியம்)</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.freqChip, timingNight && styles.freqChipActive]}
                onPress={() => setTimingNight(!timingNight)}
              >
                <Text style={[styles.freqChipText, timingNight && styles.freqChipTextActive]}>Night (இரவு)</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Food Relation:</Text>
            <View style={styles.toggleFreqRow}>
              <TouchableOpacity 
                style={[styles.foodChip, newMedFoodTiming === 'before_food' && styles.foodChipActive]}
                onPress={() => setNewMedFoodTiming('before_food')}
              >
                <Text style={[styles.foodChipText, newMedFoodTiming === 'before_food' && styles.foodChipTextActive]}>Before Food</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.foodChip, newMedFoodTiming === 'after_food' && styles.foodChipActive]}
                onPress={() => setNewMedFoodTiming('after_food')}
              >
                <Text style={[styles.foodChipText, newMedFoodTiming === 'after_food' && styles.foodChipTextActive]}>After Food</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.saveMedBtn} onPress={handleAddCustomMedicine}>
              <Text style={styles.saveMedBtnText}>Save Medicine Reminder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Checkup Modal */}
      <Modal visible={checkupModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Schedule Doctor Checkup</Text>
              <TouchableOpacity onPress={() => setCheckupModalVisible(false)}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Doctor Name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Dr. K. Rajesh, M.D."
              placeholderTextColor={colors.textMuted}
              value={docName}
              onChangeText={setDocName}
            />

            <Text style={styles.inputLabel}>Clinic or Hospital</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Apollo Speciality Clinic"
              placeholderTextColor={colors.textMuted}
              value={clinicName}
              onChangeText={setClinicName}
            />

            <Text style={styles.inputLabel}>Appointment Date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="2026-11-05"
              placeholderTextColor={colors.textMuted}
              value={checkupDate}
              onChangeText={setCheckupDate}
            />

            <Text style={styles.inputLabel}>Notes / Instructions</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Bring fasting blood test report"
              placeholderTextColor={colors.textMuted}
              value={checkupNotes}
              onChangeText={setCheckupNotes}
            />

            <TouchableOpacity style={styles.saveMedBtn} onPress={handleAddDoctorCheckup}>
              <Text style={styles.saveMedBtnText}>Save Appointment Reminder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  addMedHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.md
  },
  addMedHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textWhite,
    marginLeft: 2
  },
  scanBanner: {
    backgroundColor: colors.bgDark,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md
  },
  scanTextArea: {
    marginBottom: spacing.sm
  },
  scanTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textWhite
  },
  scanSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2
  },
  scanBtnRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  cameraBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs
  },
  cameraBtnText: {
    color: colors.textWhite,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6
  },
  galleryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    paddingVertical: 10,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.xs
  },
  galleryBtnText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6
  },
  loadingBox: {
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.sm
  },
  mealStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  mealItem: {
    flex: 1,
    alignItems: 'center'
  },
  mealDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border
  },
  mealLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2
  },
  mealTime: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 1
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary
  },
  sectionCounter: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.sm
  },
  emptySub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2
  },
  addCheckupText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary
  },
  checkupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border
  },
  checkupIconBox: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm
  },
  checkupDetails: {
    flex: 1
  },
  checkupDoc: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary
  },
  checkupClinic: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1
  },
  checkupDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3
  },
  checkupDateTime: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.secondary,
    marginLeft: 4
  },
  checkupNotes: {
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 2
  },
  checkupSyncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full
  },
  checkupSyncText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.success,
    marginLeft: 2
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: colors.bgCard,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    maxHeight: '85%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 4,
    marginTop: spacing.xs
  },
  modalInput: {
    backgroundColor: colors.bgHighlight,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    fontSize: 13,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xs
  },
  modalInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  toggleFreqRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm
  },
  freqChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.bgHighlight,
    alignItems: 'center',
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: colors.border
  },
  freqChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  freqChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary
  },
  freqChipTextActive: {
    color: colors.textWhite
  },
  foodChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.bgHighlight,
    alignItems: 'center',
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: colors.border
  },
  foodChipActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark
  },
  foodChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary
  },
  foodChipTextActive: {
    color: colors.textWhite
  },
  saveMedBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.md
  },
  saveMedBtnText: {
    color: colors.textWhite,
    fontSize: 14,
    fontWeight: '700'
  }
});

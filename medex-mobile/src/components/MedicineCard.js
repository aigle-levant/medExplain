import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export const MedicineCard = ({ 
  medicine, 
  isTaken = false, 
  onToggleTaken,
  onDelete
}) => {
  const timings = medicine.timings || {};

  const getFoodTimingLabel = (ft) => {
    if (ft === 'before_food') return 'Before Food (சாப்பாட்டிற்கு முன்)';
    if (ft === 'after_food') return 'After Food (சாப்பாட்டிற்கு பின்)';
    if (ft === 'with_food') return 'With Food (உணவுடன்)';
    return 'After Food';
  };

  return (
    <View style={[styles.card, isTaken && styles.cardTaken]}>
      <View style={styles.topRow}>
        <View style={styles.iconCircle}>
          <Ionicons 
            name={isTaken ? 'checkmark-circle' : 'medical'} 
            size={20} 
            color={isTaken ? colors.success : colors.primary} 
          />
        </View>

        <View style={styles.infoArea}>
          <Text style={[styles.medName, isTaken && styles.textStrikethrough]}>
            {medicine.name}
          </Text>
          <Text style={styles.dosageText}>
            {medicine.dosage || '1 tablet'} • {medicine.durationDays || 5} days course
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.takenButton, isTaken && styles.takenButtonActive]}
          onPress={onToggleTaken}
        >
          <Ionicons 
            name={isTaken ? 'checkmark' : 'ellipse-outline'} 
            size={18} 
            color={isTaken ? colors.textWhite : colors.primary} 
          />
          <Text style={[styles.takenButtonText, isTaken && styles.takenButtonTextActive]}>
            {isTaken ? 'Taken' : 'Take'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Frequency Pills */}
      <View style={styles.timingRow}>
        <View style={[styles.timeChip, timings.breakfast && styles.timeChipActive]}>
          <Ionicons name="sunny-outline" size={13} color={timings.breakfast ? colors.textWhite : colors.textMuted} />
          <Text style={[styles.timeChipText, timings.breakfast && styles.timeChipTextActive]}>Morning</Text>
        </View>

        <View style={[styles.timeChip, timings.lunch && styles.timeChipActive]}>
          <Ionicons name="partly-sunny-outline" size={13} color={timings.lunch ? colors.textWhite : colors.textMuted} />
          <Text style={[styles.timeChipText, timings.lunch && styles.timeChipTextActive]}>Noon</Text>
        </View>

        <View style={[styles.timeChip, timings.dinner && styles.timeChipActive]}>
          <Ionicons name="moon-outline" size={13} color={timings.dinner ? colors.textWhite : colors.textMuted} />
          <Text style={[styles.timeChipText, timings.dinner && styles.timeChipTextActive]}>Night</Text>
        </View>

        {medicine.frequencyNotation ? (
          <View style={styles.notationBadge}>
            <Text style={styles.notationText}>{medicine.frequencyNotation}</Text>
          </View>
        ) : null}
      </View>

      {/* Food instructions */}
      <View style={styles.metaRow}>
        <View style={styles.foodTag}>
          <Ionicons name="restaurant-outline" size={12} color={colors.primaryDark} />
          <Text style={styles.foodTagText}>{getFoodTimingLabel(medicine.foodTiming)}</Text>
        </View>
        
        {onDelete ? (
          <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={16} color={colors.danger} />
          </TouchableOpacity>
        ) : null}
      </View>

      {medicine.specialInstructions ? (
        <Text style={styles.instructionsText}>
          Note: {medicine.specialInstructions}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border
  },
  cardTaken: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
    opacity: 0.8
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm
  },
  infoArea: {
    flex: 1
  },
  medName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary
  },
  textStrikethrough: {
    textDecorationLine: 'line-through',
    color: colors.textMuted
  },
  dosageText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2
  },
  takenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight
  },
  takenButtonActive: {
    backgroundColor: colors.success,
    borderColor: colors.success
  },
  takenButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 4
  },
  takenButtonTextActive: {
    color: colors.textWhite
  },
  timingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    flexWrap: 'wrap'
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.bgHighlight,
    marginRight: spacing.xs,
    marginBottom: 4
  },
  timeChipActive: {
    backgroundColor: colors.primary
  },
  timeChipText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: 4,
    fontWeight: '600'
  },
  timeChipTextActive: {
    color: colors.textWhite
  },
  notationBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: '#EDE9FE',
    borderRadius: borderRadius.sm,
    marginLeft: 4,
    marginBottom: 4
  },
  notationText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6D28D9'
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs
  },
  foodTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start'
  },
  foodTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primaryDark,
    marginLeft: 4
  },
  deleteBtn: {
    padding: 4
  },
  instructionsText: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 6
  }
});

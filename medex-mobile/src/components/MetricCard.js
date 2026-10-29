import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/colors';
import { Badge } from './Badge';
import { Ionicons } from '@expo/vector-icons';

export const MetricCard = ({ metric, preferredLanguage = 'both' }) => {
  const [expanded, setExpanded] = useState(false);

  const isAbnormal = metric.status !== 'NORMAL';

  return (
    <View style={[styles.card, isAbnormal && styles.cardAbnormal]}>
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => setExpanded(!expanded)}
        style={styles.headerRow}
      >
        <View style={styles.titleArea}>
          <Text style={styles.metricName}>{metric.name}</Text>
          <Text style={styles.rangeText}>Normal Range: {metric.range}</Text>
        </View>

        <View style={styles.valueArea}>
          <Text style={[styles.metricValue, isAbnormal && styles.valueAbnormal]}>
            {metric.value} <Text style={styles.unitText}>{metric.unit}</Text>
          </Text>
          <Badge label={metric.status} type={metric.status} size="sm" />
        </View>
      </TouchableOpacity>

      {/* Explanations */}
      {(expanded || isAbnormal) && (
        <View style={styles.explanationBox}>
          {(preferredLanguage === 'en' || preferredLanguage === 'both') && metric.explanation_en ? (
            <View style={styles.langRow}>
              <View style={styles.langPill}>
                <Text style={styles.langPillText}>EN</Text>
              </View>
              <Text style={styles.explanationText}>{metric.explanation_en}</Text>
            </View>
          ) : null}

          {(preferredLanguage === 'ta' || preferredLanguage === 'both') && metric.explanation_ta ? (
            <View style={[styles.langRow, { marginTop: spacing.xs }]}>
              <View style={[styles.langPill, { backgroundColor: colors.tamilBg }]}>
                <Text style={[styles.langPillText, { color: colors.tamilAccent }]}>தமிழ்</Text>
              </View>
              <Text style={[styles.explanationText, { color: '#78350F' }]}>{metric.explanation_ta}</Text>
            </View>
          ) : null}
        </View>
      )}

      <TouchableOpacity 
        style={styles.expandToggle}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.toggleText}>{expanded ? 'Less info' : 'View explanation'}</Text>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={14} color={colors.primary} />
      </TouchableOpacity>
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
  cardAbnormal: {
    borderColor: '#FED7AA',
    backgroundColor: '#FFFDF9'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  titleArea: {
    flex: 1,
    paddingRight: spacing.sm
  },
  metricName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary
  },
  rangeText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2
  },
  valueArea: {
    alignItems: 'flex-end'
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4
  },
  valueAbnormal: {
    color: '#C2410C'
  },
  unitText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary
  },
  explanationBox: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 2
  },
  langPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs,
    marginTop: 1
  },
  langPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryDark
  },
  explanationText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary
  },
  expandToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
    paddingTop: spacing.xs
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 4
  }
});

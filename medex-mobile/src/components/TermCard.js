import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/colors';
import { Badge } from './Badge';
import { Ionicons } from '@expo/vector-icons';

export const TermCard = ({ term }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => setExpanded(!expanded)}
        style={styles.headerRow}
      >
        <View style={styles.titleArea}>
          <Text style={styles.englishTerm}>{term.english_term}</Text>
          <View style={styles.tamilRow}>
            <Text style={styles.tamilTerm}>{term.tamil_term}</Text>
            {term.tamil_transliteration ? (
              <Text style={styles.translitText}>({term.tamil_transliteration})</Text>
            ) : null}
          </View>
        </View>

        {term.category ? (
          <Badge label={term.category} type="primary" size="sm" />
        ) : null}
      </TouchableOpacity>

      {/* Quick Layman Definitions */}
      <View style={styles.definitionBox}>
        <View style={styles.langRow}>
          <View style={styles.langBadge}><Text style={styles.langBadgeText}>EN</Text></View>
          <Text style={styles.defText}>{term.simple_english}</Text>
        </View>

        <View style={[styles.langRow, { marginTop: 4 }]}>
          <View style={[styles.langBadge, { backgroundColor: colors.tamilBg }]}>
            <Text style={[styles.langBadgeText, { color: colors.tamilAccent }]}>தமிழ்</Text>
          </View>
          <Text style={[styles.defText, { color: '#78350F' }]}>{term.simple_tamil}</Text>
        </View>
      </View>

      {/* Expandable Clinical Definition */}
      {expanded && term.medical_definition ? (
        <View style={styles.clinicalBox}>
          <Text style={styles.clinicalLabel}>Clinical Definition:</Text>
          <Text style={styles.clinicalText}>{term.medical_definition}</Text>
        </View>
      ) : null}

      <TouchableOpacity 
        style={styles.moreToggle}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.toggleText}>{expanded ? 'Hide clinical details' : 'View clinical details'}</Text>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={12} color={colors.primary} />
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  titleArea: {
    flex: 1,
    paddingRight: spacing.sm
  },
  englishTerm: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary
  },
  tamilRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 2
  },
  tamilTerm: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.tamilAccent
  },
  translitText: {
    fontSize: 12,
    color: colors.textMuted,
    marginLeft: 6
  },
  definitionBox: {
    marginTop: spacing.sm,
    paddingTop: spacing.xs
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  langBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryLight,
    marginRight: 6,
    marginTop: 1
  },
  langBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primaryDark
  },
  defText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary
  },
  clinicalBox: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.bgMuted,
    borderRadius: borderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary
  },
  clinicalLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 2
  },
  clinicalText: {
    fontSize: 12,
    color: colors.textPrimary,
    lineHeight: 17
  },
  moreToggle: {
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

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing } from '../theme/colors';

export const Badge = ({ label, type = 'normal', size = 'md' }) => {
  let bg = colors.bgHighlight;
  let text = colors.textSecondary;
  let border = colors.border;

  const t = (type || '').toLowerCase();
  if (t === 'normal' || t === 'optimal' || t === 'healthy') {
    bg = colors.successLight;
    text = colors.success;
    border = '#A7F3D0';
  } else if (t === 'high' || t === 'warning' || t === 'attention_needed' || t === 'moderate') {
    bg = colors.warningLight;
    text = '#B45309';
    border = '#FDE68A';
  } else if (t === 'low' || t === 'danger' || t === 'critical') {
    bg = colors.dangerLight;
    text = colors.danger;
    border = '#FECACA';
  } else if (t === 'primary' || t === 'info') {
    bg = colors.primaryLight;
    text = colors.primaryDark;
    border = '#99F6E4';
  } else if (t === 'tamil') {
    bg = colors.tamilBg;
    text = colors.tamilAccent;
    border = '#FDE68A';
  }

  const isSmall = size === 'sm';

  return (
    <View style={[
      styles.badge, 
      { backgroundColor: bg, borderColor: border },
      isSmall && styles.badgeSm
    ]}>
      <Text style={[
        styles.text, 
        { color: text },
        isSmall && styles.textSm
      ]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start'
  },
  badgeSm: {
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  textSm: {
    fontSize: 10
  }
});

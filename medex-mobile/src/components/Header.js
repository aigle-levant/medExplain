import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export const Header = ({ title, subtitle, rightAction, icon = 'medical' }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={22} color={colors.primary} />
        </View>
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      {rightAction ? (
        <View style={styles.rightContainer}>
          {rightAction}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.bgDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B'
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: '#0F2F38',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textWhite,
    letterSpacing: 0.3
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

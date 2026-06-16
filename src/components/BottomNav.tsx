import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { TabName } from '../types';

interface Props {
  active: TabName;
  onChange: (tab: TabName) => void;
  urgentCount: number;
}

const TABS: { id: TabName; icon: string; activeIcon: string; label: string }[] = [
  { id: 'home', icon: 'home-outline', activeIcon: 'home', label: 'Início' },
  { id: 'materias', icon: 'book-outline', activeIcon: 'book', label: 'Matérias' },
  { id: 'tarefas', icon: 'checkbox-outline', activeIcon: 'checkbox', label: 'Tarefas' },
  { id: 'grupos', icon: 'people-outline', activeIcon: 'people', label: 'Grupos' },
  { id: 'lembretes', icon: 'notifications-outline', activeIcon: 'notifications', label: 'Alertas' },
  { id: 'perfil', icon: 'person-outline', activeIcon: 'person', label: 'Perfil' },
];

export function BottomNav({ active, onChange, urgentCount }: Props) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        const showBadge = tab.id === 'lembretes' && urgentCount > 0;

        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onChange(tab.id)}
            style={styles.tab}
            activeOpacity={0.7}
          >
            {isActive && <View style={styles.activeBackground} />}
            <View style={styles.iconWrapper}>
              <Ionicons
                name={(isActive ? tab.activeIcon : tab.icon) as any}
                size={23}
                color={isActive ? '#a78bfa' : '#4a4a6a'}
              />
              {showBadge && <View style={styles.badge} />}
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.activeDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(13,13,26,0.97)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(124,58,237,0.2)',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 14,
    position: 'relative',
    gap: 3,
  },
  activeBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(124,58,237,0.12)',
    borderRadius: 14,
  },
  iconWrapper: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -1,
    right: -3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    borderWidth: 1.5,
    borderColor: '#0d0d1a',
  },
  label: {
    color: '#4a4a6a',
    fontSize: 10,
    fontWeight: '500',
  },
  labelActive: {
    color: '#a78bfa',
    fontWeight: '700',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#7c3aed',
    position: 'absolute',
    bottom: 0,
  },
});
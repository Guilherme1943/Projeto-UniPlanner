import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { User } from '../types';

interface Stats {
  subjects: number;
  tasks: number;
  doneTasks: number;
  groups: number;
  reminders: number;
}

interface Props {
  user: User;
  stats: Stats;
  onLogout: () => void;
}

export default function ProfileScreen({ user, stats, onLogout }: Props) {
  const rate = stats.tasks > 0 ? Math.round((stats.doneTasks / stats.tasks) * 100) : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Hero */}
      <LinearGradient colors={['#1e0a4a', '#1a1060', '#13132b']} style={styles.hero}>
        <View style={styles.avatarBox}>
          <Text style={styles.avatarInitial}>{user.name[0]}</Text>
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={13} color="#a78bfa" />
          <Text style={styles.infoText}>{user.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="school-outline" size={13} color="#a78bfa" />
          <Text style={styles.infoText}>{user.course}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>UNINASSAU · ADS</Text>
        </View>
      </LinearGradient>

      {/* Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Meu progresso</Text>
        <View style={styles.statsGrid}>
          <StatCard icon="book-outline" label="Matérias" value={stats.subjects} color="#7c3aed" />
          <StatCard icon="checkbox-outline" label="Tarefas" value={stats.tasks} color="#4f46e5" />
          <StatCard icon="people-outline" label="Grupos" value={stats.groups} color="#2563eb" />
          <StatCard icon="notifications-outline" label="Lembretes" value={stats.reminders} color="#9333ea" />
        </View>
      </View>

      {/* Completion */}
      <View style={styles.section}>
        <View style={styles.completionCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <View style={styles.completionIcon}>
              <Ionicons name="trending-up-outline" size={20} color="#7c3aed" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.completionTitle}>Taxa de conclusão</Text>
              <Text style={styles.completionSub}>{stats.doneTasks} de {stats.tasks} tarefas</Text>
            </View>
            <Text style={styles.completionPct}>{rate}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${rate}%` as any }]} />
          </View>
          {rate >= 70 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 }}>
              <Ionicons name="trophy-outline" size={14} color="#f59e0b" />
              <Text style={{ color: '#f59e0b', fontSize: 13, fontWeight: '600' }}>
                Ótimo desempenho! Continue assim 🎉
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Semester info */}
      <View style={styles.section}>
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Informações do semestre</Text>
          <InfoRow label="Instituição" value="UNINASSAU" />
          <InfoRow label="Curso" value="Análise e Des. de Sistemas" />
          <InfoRow label="Semestre" value="2025.2" />
          <InfoRow label="Disciplinas" value="Backend · BD · Mobile" />
        </View>
      </View>

      {/* Logout */}
      <View style={styles.section}>
        <TouchableOpacity onPress={onLogout} style={styles.logoutBtn} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <View style={[styles.statCard, { borderColor: `${color}25` }]}>
      <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRowContainer}>
      <Text style={styles.infoRowLabel}>{label}</Text>
      <Text style={styles.infoRowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  hero: {
    alignItems: 'center', paddingTop: 60, paddingBottom: 32, paddingHorizontal: 20,
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28, gap: 8,
  },
  avatarBox: {
    width: 80, height: 80, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary, shadowOpacity: 0.5, shadowRadius: 16, shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  avatarInitial: { color: '#fff', fontSize: 34, fontWeight: '800' },
  userName: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 4 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoText: { color: Colors.textMuted, fontSize: 13 },
  badge: {
    paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20,
    backgroundColor: 'rgba(124,58,237,0.2)', borderWidth: 1, borderColor: 'rgba(124,58,237,0.4)',
    marginTop: 4,
  },
  badgeText: { color: '#a78bfa', fontSize: 12, fontWeight: '600' },
  section: { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { color: Colors.text, fontSize: 15, fontWeight: '700', marginBottom: 12 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: {
    width: '47%', backgroundColor: Colors.card, borderRadius: 18, borderWidth: 1,
    padding: 16, gap: 6,
  },
  statIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statValue: { color: Colors.text, fontSize: 26, fontWeight: '800' },
  statLabel: { color: Colors.textMuted, fontSize: 12 },
  completionCard: {
    backgroundColor: Colors.card, borderRadius: 18, borderWidth: 1, borderColor: Colors.border,
    padding: 16,
  },
  completionIcon: {
    width: 42, height: 42, borderRadius: 13, backgroundColor: 'rgba(124,58,237,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  completionTitle: { color: Colors.text, fontSize: 15, fontWeight: '700' },
  completionSub: { color: Colors.textMuted, fontSize: 12, marginTop: 1 },
  completionPct: { color: '#a78bfa', fontSize: 24, fontWeight: '800' },
  progressTrack: { height: 10, backgroundColor: '#1e1e3f', borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 5, backgroundColor: Colors.primary },
  infoCard: {
    backgroundColor: Colors.card, borderRadius: 18, borderWidth: 1, borderColor: Colors.border,
    padding: 16, gap: 12,
  },
  infoCardTitle: { color: '#c4b5fd', fontSize: 13, fontWeight: '700', marginBottom: 4 },
  infoRowContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoRowLabel: { color: Colors.textMuted, fontSize: 13 },
  infoRowValue: { color: '#c4b5fd', fontSize: 13, fontWeight: '600' },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    paddingVertical: 16, borderRadius: 18,
    backgroundColor: 'rgba(239,68,68,0.08)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)',
  },
  logoutText: { color: '#ef4444', fontWeight: '700', fontSize: 16 },
});

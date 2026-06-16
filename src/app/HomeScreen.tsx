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
import { User, Task, Subject, TabName } from '../types';

interface Props {
  user: User;
  tasks: Task[];
  subjects: Subject[];
  onNavigate: (tab: TabName) => void;
}

const priorityColor = { alta: '#ef4444', média: '#f59e0b', baixa: '#22c55e' };

export default function HomeScreen({ user, tasks, subjects, onNavigate }: Props) {
  const firstName = user.name.split(' ')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  const pending = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);
  const progress = tasks.length > 0 ? Math.round((done.length / tasks.length) * 100) : 0;

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      {/* Header */}
      <LinearGradient colors={['#1e0a4a', '#1a1060', '#13132b']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greetingLabel}>{greeting},</Text>
            <Text style={styles.greetingName}>{firstName} 👋</Text>
            <Text style={styles.greetingCourse}>{user.course}</Text>
          </View>
          <TouchableOpacity onPress={() => onNavigate('lembretes')} style={styles.bellBtn}>
            <Ionicons name="notifications-outline" size={20} color="#c4b5fd" />
            <View style={styles.bellDot} />
          </TouchableOpacity>
        </View>

        {/* Progress card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progresso do dia</Text>
            <Text style={styles.progressPct}>{progress}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` as any }]} />
          </View>
          <View style={styles.progressStats}>
            <StatPill label="Pendentes" value={pending.length} color="#f59e0b" />
            <StatPill label="Concluídas" value={done.length} color="#22c55e" />
            <StatPill label="Matérias" value={subjects.length} color="#818cf8" />
          </View>
        </View>
      </LinearGradient>

      {/* Quick access */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acesso rápido</Text>
        <View style={styles.quickGrid}>
          {[
            { icon: 'book-outline', label: 'Matérias', tab: 'materias' as TabName, color: '#7c3aed' },
            { icon: 'checkbox-outline', label: 'Tarefas', tab: 'tarefas' as TabName, color: '#4f46e5' },
            { icon: 'star-outline', label: 'Provas', tab: 'tarefas' as TabName, color: '#2563eb' },
            { icon: 'people-outline', label: 'Grupos', tab: 'grupos' as TabName, color: '#6d28d9' },
          ].map((item, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => onNavigate(item.tab)}
              style={styles.quickItem}
              activeOpacity={0.75}
            >
              <View style={[styles.quickIcon, { backgroundColor: `${item.color}22` }]}>
                <Ionicons name={item.icon as any} size={22} color={item.color} />
              </View>
              <Text style={styles.quickLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Upcoming tasks */}
      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Próximas entregas</Text>
          <TouchableOpacity onPress={() => onNavigate('tarefas')} style={styles.rowCenter}>
            <Text style={styles.seeAll}>Ver tudo</Text>
            <Ionicons name="chevron-forward" size={14} color="#a78bfa" />
          </TouchableOpacity>
        </View>
        {pending.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="trending-up-outline" size={32} color={Colors.textMuted} />
            <Text style={styles.emptyText}>Nenhuma tarefa pendente!</Text>
          </View>
        ) : (
          pending.slice(0, 3).map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </View>

      {/* Subjects */}
      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Minhas matérias</Text>
          <TouchableOpacity onPress={() => onNavigate('materias')} style={styles.rowCenter}>
            <Text style={styles.seeAll}>Ver tudo</Text>
            <Ionicons name="chevron-forward" size={14} color="#a78bfa" />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
          {subjects.slice(0, 5).map((s) => (
            <View key={s.id} style={[styles.subjectPill, { borderColor: `${s.color}44` }]}>
              <View style={[styles.subjectBar, { backgroundColor: s.color }]} />
              <Text style={styles.subjectName}>{s.name}</Text>
              <Text style={styles.subjectProf}>{s.professor}</Text>
              <View style={styles.rowCenter}>
                <Ionicons name="calendar-outline" size={11} color={s.color} style={{ marginRight: 4 }} />
                <Text style={[styles.subjectSchedule, { color: s.color }]}>{s.schedule}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: color }} />
      <Text style={{ color: Colors.textMuted, fontSize: 11 }}>
        <Text style={{ color, fontWeight: '700' }}>{value}</Text> {label}
      </Text>
    </View>
  );
}

function TaskCard({ task }: { task: Task }) {
  return (
    <View style={styles.taskCard}>
      <View style={[styles.taskStripe, { backgroundColor: priorityColor[task.priority] }]} />
      <View style={{ flex: 1 }}>
        <Text style={styles.taskTitle} numberOfLines={1}>{task.title}</Text>
        <Text style={styles.taskSubject}>{task.subject}</Text>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 4 }}>
        <View style={styles.taskTypeBadge}>
          <Text style={styles.taskTypeText}>{task.type}</Text>
        </View>
        {task.dueDate ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Ionicons name="time-outline" size={10} color={priorityColor[task.priority]} />
            <Text style={styles.taskDate}>{task.dueDate}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greetingLabel: {
    color: '#a78bfa',
    fontSize: 13,
    fontWeight: '500',
  },
  greetingName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
  },
  greetingCourse: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(124,58,237,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  progressCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.2)',
    padding: 16,
    gap: 10,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    color: '#c4b5fd',
    fontSize: 13,
    fontWeight: '600',
  },
  progressPct: {
    color: '#a78bfa',
    fontSize: 13,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  progressStats: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 12,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAll: {
    color: '#a78bfa',
    fontSize: 13,
  },
  quickGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickItem: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    alignItems: 'center',
    gap: 8,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    color: '#c4b5fd',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  taskStripe: {
    width: 4,
    alignSelf: 'stretch',
    borderRadius: 2,
  },
  taskTitle: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  taskSubject: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  taskTypeBadge: {
    backgroundColor: 'rgba(124,58,237,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  taskTypeText: {
    color: '#a78bfa',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  taskDate: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  subjectPill: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    width: 148,
    gap: 4,
  },
  subjectBar: {
    width: 32,
    height: 5,
    borderRadius: 3,
    marginBottom: 4,
  },
  subjectName: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  subjectProf: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  subjectSchedule: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
});

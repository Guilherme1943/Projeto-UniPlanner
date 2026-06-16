import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Task, Subject } from '../types';

interface Props {
  tasks: Task[];
  subjects: Subject[];
  onAdd: (t: Omit<Task, 'id' | 'done'>) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityColor = { alta: '#ef4444', média: '#f59e0b', baixa: '#22c55e' };
type FilterType = 'todas' | 'tarefa' | 'prova' | 'trabalho';

export default function TasksScreen({ tasks, subjects, onAdd, onToggle, onDelete }: Props) {
  const [filter, setFilter] = useState<FilterType>('todas');
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState<Omit<Task, 'id' | 'done'>>({
    title: '', subject: '', dueDate: '', priority: 'média', type: 'tarefa', description: '',
  });

  const filtered = filter === 'todas' ? tasks : tasks.filter((t) => t.type === filter);
  const pending = filtered.filter((t) => !t.done);
  const done = filtered.filter((t) => t.done);

  const handleAdd = () => {
    if (!form.title.trim()) return;
    onAdd({ ...form, subject: form.subject || (subjects[0]?.name ?? 'Geral') });
    setForm({ title: '', subject: '', dueDate: '', priority: 'média', type: 'tarefa', description: '' });
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1e0a4a', '#13132b']} style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Tarefas & Provas</Text>
            <Text style={styles.headerSubtitle}>{pending.length} pendente(s)</Text>
          </View>
          <TouchableOpacity onPress={() => setVisible(true)} style={styles.addBtn}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 16 }} contentContainerStyle={{ gap: 8 }}>
          {(['todas', 'tarefa', 'prova', 'trabalho'] as FilterType[]).map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f === 'todas' ? 'Todas' : f.charAt(0).toUpperCase() + f.slice(1) + 's'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 10 }} showsVerticalScrollIndicator={false}>
        {pending.length === 0 && done.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="filter-outline" size={36} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>Nenhuma tarefa</Text>
            <Text style={styles.emptyDesc}>Adicione tarefas, provas e trabalhos</Text>
          </View>
        ) : (
          <>
            {pending.length > 0 && (
              <>
                <View style={styles.sectionRow}>
                  <Ionicons name="time-outline" size={14} color="#f59e0b" />
                  <Text style={styles.sectionLabel}>PENDENTES ({pending.length})</Text>
                </View>
                {pending.map((t) => (
                  <TaskItem key={t.id} task={t} onToggle={() => onToggle(t.id)} onDelete={() => onDelete(t.id)}
                    subjectColor={subjects.find((s) => s.name === t.subject)?.color} />
                ))}
              </>
            )}
            {done.length > 0 && (
              <>
                <View style={[styles.sectionRow, { marginTop: 10 }]}>
                  <Ionicons name="checkmark-circle-outline" size={14} color="#22c55e" />
                  <Text style={styles.sectionLabel}>CONCLUÍDAS ({done.length})</Text>
                </View>
                {done.map((t) => (
                  <TaskItem key={t.id} task={t} onToggle={() => onToggle(t.id)} onDelete={() => onDelete(t.id)}
                    subjectColor={subjects.find((s) => s.name === t.subject)?.color} />
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>

      <Modal visible={visible} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nova Tarefa / Prova</Text>
              <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ gap: 14 }} keyboardShouldPersistTaps="handled">
              <FieldInput label="Título" placeholder="Ex: Lista de exercícios 3" value={form.title} onChangeText={(v) => setForm((f) => ({ ...f, title: v }))} />

              {/* Type */}
              <View>
                <Text style={styles.fieldLabel}>Tipo</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {(['tarefa', 'prova', 'trabalho'] as const).map((tp) => (
                    <TouchableOpacity key={tp} onPress={() => setForm((f) => ({ ...f, type: tp }))}
                      style={[styles.optionBtn, form.type === tp && styles.optionBtnActive, { flex: 1 }]}>
                      <Text style={[styles.optionText, form.type === tp && { color: '#fff' }]}>
                        {tp.charAt(0).toUpperCase() + tp.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Subject picker */}
              <View>
                <Text style={styles.fieldLabel}>Matéria</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {subjects.map((s) => (
                    <TouchableOpacity key={s.id} onPress={() => setForm((f) => ({ ...f, subject: s.name }))}
                      style={[styles.subjectChip, form.subject === s.name && { backgroundColor: s.color, borderColor: s.color }]}>
                      <Text style={[styles.subjectChipText, form.subject === s.name && { color: '#fff' }]}>{s.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <FieldInput label="Data de entrega" placeholder="DD/MM/AAAA" value={form.dueDate} onChangeText={(v) => setForm((f) => ({ ...f, dueDate: v }))} />

              {/* Priority */}
              <View>
                <Text style={styles.fieldLabel}>Prioridade</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {(['baixa', 'média', 'alta'] as const).map((p) => (
                    <TouchableOpacity key={p} onPress={() => setForm((f) => ({ ...f, priority: p }))}
                      style={[styles.optionBtn, form.priority === p && { backgroundColor: priorityColor[p], borderColor: priorityColor[p] }, { flex: 1 }]}>
                      <Text style={[styles.optionText, form.priority === p && { color: '#fff' }]}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <FieldInput label="Descrição (opcional)" placeholder="Detalhes..." value={form.description ?? ''} onChangeText={(v) => setForm((f) => ({ ...f, description: v }))} />

              <TouchableOpacity onPress={handleAdd} activeOpacity={0.85}>
                <LinearGradient colors={['#7c3aed', '#4f46e5']} style={styles.submitBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.submitText}>Adicionar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function TaskItem({ task, onToggle, onDelete, subjectColor }: {
  task: Task; onToggle: () => void; onDelete: () => void; subjectColor?: string;
}) {
  const color = subjectColor ?? '#7c3aed';
  return (
    <View style={[styles.taskCard, { opacity: task.done ? 0.55 : 1, borderColor: task.done ? 'rgba(34,197,94,0.15)' : Colors.border }]}>
      <TouchableOpacity onPress={onToggle} style={[styles.checkbox, task.done ? styles.checkboxDone : { borderColor: priorityColor[task.priority] }]}>
        {task.done && <Ionicons name="checkmark" size={13} color="#fff" />}
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Text style={[styles.taskTitle, task.done && { textDecorationLine: 'line-through' }]} numberOfLines={1}>{task.title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color }} />
          <Text style={styles.taskSub}>{task.subject}</Text>
          {task.dueDate ? (
            <>
              <Ionicons name="time-outline" size={10} color={priorityColor[task.priority]} />
              <Text style={styles.taskSub}>{task.dueDate}</Text>
            </>
          ) : null}
        </View>
      </View>
      <View style={[styles.priorityBadge, { backgroundColor: `${priorityColor[task.priority]}22` }]}>
        <Text style={[styles.priorityText, { color: priorityColor[task.priority] }]}>
          {task.priority.toUpperCase()}
        </Text>
      </View>
      <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
        <Ionicons name="trash-outline" size={13} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );
}

function FieldInput({ label, placeholder, value, onChangeText }: {
  label: string; placeholder: string; value: string; onChangeText: (v: string) => void;
}) {
  return (
    <View>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        style={styles.textInput}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 20,
    borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  headerSubtitle: { color: Colors.textMuted, fontSize: 13 },
  addBtn: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  filterChipActive: { backgroundColor: Colors.primary },
  filterText: { color: Colors.textMuted, fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  sectionLabel: { color: Colors.textMuted, fontSize: 12, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingVertical: 60, gap: 8 },
  emptyTitle: { color: '#c4b5fd', fontSize: 16, fontWeight: '700' },
  emptyDesc: { color: Colors.textMuted, fontSize: 13 },
  taskCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12,
    backgroundColor: Colors.card, borderRadius: 16, borderWidth: 1,
  },
  checkbox: {
    width: 24, height: 24, borderRadius: 8, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#1e1e3f',
  },
  checkboxDone: { backgroundColor: '#22c55e', borderWidth: 0 },
  taskTitle: { color: Colors.text, fontSize: 14, fontWeight: '600' },
  taskSub: { color: Colors.textMuted, fontSize: 11 },
  priorityBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  priorityText: { fontSize: 10, fontWeight: '700' },
  deleteBtn: {
    width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(239,68,68,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.7)' },
  modalSheet: {
    backgroundColor: Colors.card, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 20, paddingBottom: 36, maxHeight: '92%',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: Colors.text, fontSize: 18, fontWeight: '800' },
  closeBtn: {
    width: 32, height: 32, borderRadius: 10, backgroundColor: '#1e1e3f',
    alignItems: 'center', justifyContent: 'center',
  },
  fieldLabel: { color: '#c4b5fd', fontSize: 13, fontWeight: '600', marginBottom: 8 },
  textInput: {
    backgroundColor: '#1e1e3f', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
    color: Colors.text, fontSize: 14, borderWidth: 1, borderColor: 'rgba(124,58,237,0.2)',
  },
  optionBtn: {
    paddingVertical: 10, borderRadius: 12, alignItems: 'center',
    backgroundColor: '#1e1e3f', borderWidth: 1, borderColor: 'rgba(124,58,237,0.2)',
  },
  optionBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  optionText: { color: Colors.textMuted, fontWeight: '600', fontSize: 13 },
  subjectChip: {
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10,
    backgroundColor: '#1e1e3f', borderWidth: 1, borderColor: 'rgba(124,58,237,0.2)',
  },
  subjectChipText: { color: Colors.textMuted, fontSize: 12, fontWeight: '600' },
  submitBtn: { paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 4 },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
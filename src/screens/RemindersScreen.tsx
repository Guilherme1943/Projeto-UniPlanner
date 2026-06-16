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
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Reminder } from '../types';

interface Props {
  reminders: Reminder[];
  onAdd: (r: Omit<Reminder, 'id'>) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const typeColor = { prazo: '#f59e0b', prova: '#ef4444', reunião: '#22c55e', outro: '#818cf8' };
const typeLabel = { prazo: 'Prazo', prova: 'Prova', reunião: 'Reunião', outro: 'Outro' };

export default function RemindersScreen({ reminders, onAdd, onToggle, onDelete }: Props) {
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState<Omit<Reminder, 'id'>>({
    title: '', message: '', date: '', time: '', type: 'prazo', active: true, urgent: false,
  });

  const handleAdd = () => {
    if (!form.title.trim()) return;
    onAdd({ ...form });
    setForm({ title: '', message: '', date: '', time: '', type: 'prazo', active: true, urgent: false });
    setVisible(false);
  };

  const active = reminders.filter((r) => r.active);
  const inactive = reminders.filter((r) => !r.active);
  const urgentCount = active.filter((r) => r.urgent).length;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1e0a4a', '#13132b']} style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Lembretes</Text>
            <Text style={styles.headerSubtitle}>{active.length} lembrete(s) ativo(s)</Text>
          </View>
          <TouchableOpacity onPress={() => setVisible(true)} style={styles.addBtn}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 10 }} showsVerticalScrollIndicator={false}>
        {/* Urgent banner */}
        {urgentCount > 0 && (
          <View style={styles.urgentBanner}>
            <Ionicons name="warning-outline" size={20} color="#ef4444" />
            <View style={{ flex: 1 }}>
              <Text style={styles.urgentTitle}>Prazos urgentes!</Text>
              <Text style={styles.urgentDesc}>{urgentCount} lembrete(s) com alta prioridade</Text>
            </View>
          </View>
        )}

        {reminders.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-outline" size={40} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>Nenhum lembrete</Text>
            <Text style={styles.emptyDesc}>Cadastre lembretes de prazos e provas</Text>
          </View>
        ) : (
          <>
            {active.length > 0 && (
              <>
                <View style={styles.sectionRow}>
                  <Ionicons name="notifications-outline" size={13} color="#a78bfa" />
                  <Text style={styles.sectionLabel}>ATIVOS ({active.length})</Text>
                </View>
                {active.map((r) => (
                  <ReminderCard key={r.id} reminder={r} onToggle={() => onToggle(r.id)} onDelete={() => onDelete(r.id)} />
                ))}
              </>
            )}
            {inactive.length > 0 && (
              <>
                <View style={[styles.sectionRow, { marginTop: 10 }]}>
                  <Ionicons name="notifications-off-outline" size={13} color={Colors.textMuted} />
                  <Text style={styles.sectionLabel}>DESATIVADOS ({inactive.length})</Text>
                </View>
                {inactive.map((r) => (
                  <ReminderCard key={r.id} reminder={r} onToggle={() => onToggle(r.id)} onDelete={() => onDelete(r.id)} />
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
              <Text style={styles.modalTitle}>Novo Lembrete</Text>
              <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ gap: 14 }} keyboardShouldPersistTaps="handled">
              <FieldInput label="Título" placeholder="Ex: Entrega do trabalho final" value={form.title} onChangeText={(v) => setForm((f) => ({ ...f, title: v }))} />
              <FieldInput label="Mensagem" placeholder="Detalhes do lembrete..." value={form.message} onChangeText={(v) => setForm((f) => ({ ...f, message: v }))} />
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <FieldInput label="Data" placeholder="DD/MM/AAAA" value={form.date} onChangeText={(v) => setForm((f) => ({ ...f, date: v }))} />
                </View>
                <View style={{ flex: 1 }}>
                  <FieldInput label="Hora" placeholder="HH:MM" value={form.time} onChangeText={(v) => setForm((f) => ({ ...f, time: v }))} />
                </View>
              </View>

              {/* Type */}
              <View>
                <Text style={styles.fieldLabel}>Tipo</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {(['prazo', 'prova', 'reunião', 'outro'] as const).map((tp) => (
                    <TouchableOpacity
                      key={tp}
                      onPress={() => setForm((f) => ({ ...f, type: tp }))}
                      style={[styles.typeBtn, form.type === tp && { backgroundColor: typeColor[tp], borderColor: typeColor[tp] }]}
                    >
                      <Text style={[styles.typeText, form.type === tp && { color: '#fff' }]}>{typeLabel[tp]}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Urgent toggle */}
              <View style={styles.switchRow}>
                <View>
                  <Text style={styles.fieldLabel}>Marcar como urgente</Text>
                  <Text style={styles.switchDesc}>Aparece com destaque no topo</Text>
                </View>
                <Switch
                  value={form.urgent}
                  onValueChange={(v) => setForm((f) => ({ ...f, urgent: v }))}
                  trackColor={{ false: '#1e1e3f', true: '#7c3aed' }}
                  thumbColor="#fff"
                />
              </View>

              <TouchableOpacity onPress={handleAdd} activeOpacity={0.85}>
                <LinearGradient colors={['#7c3aed', '#4f46e5']} style={styles.submitBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.submitText}>Criar Lembrete</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function ReminderCard({ reminder, onToggle, onDelete }: {
  reminder: Reminder; onToggle: () => void; onDelete: () => void;
}) {
  const color = typeColor[reminder.type];
  return (
    <View style={[styles.card, { opacity: reminder.active ? 1 : 0.5, borderColor: reminder.urgent ? 'rgba(239,68,68,0.3)' : `${color}25` }]}>
      <View style={[styles.iconBox, { backgroundColor: `${color}20` }]}>
        <Ionicons name={reminder.urgent ? 'warning-outline' : 'notifications-outline'} size={18} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={styles.cardTitle} numberOfLines={1}>{reminder.title}</Text>
          {reminder.urgent && (
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentBadgeText}>URGENTE</Text>
            </View>
          )}
        </View>
        {reminder.message ? <Text style={styles.cardMessage} numberOfLines={1}>{reminder.message}</Text> : null}
        {(reminder.date || reminder.time) && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 }}>
            <Ionicons name="time-outline" size={11} color={color} />
            <Text style={[styles.cardDate, { color }]}>{reminder.date} {reminder.time}</Text>
            <View style={[styles.typeBadge, { backgroundColor: `${color}20` }]}>
              <Text style={[styles.typeBadgeText, { color }]}>{typeLabel[reminder.type]}</Text>
            </View>
          </View>
        )}
      </View>
      <View style={{ gap: 6 }}>
        <TouchableOpacity onPress={onToggle} style={[styles.actionBtn, { backgroundColor: reminder.active ? 'rgba(124,58,237,0.2)' : '#1e1e3f' }]}>
          <Ionicons name={reminder.active ? 'notifications-outline' : 'notifications-off-outline'} size={14} color={reminder.active ? '#a78bfa' : Colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={[styles.actionBtn, { backgroundColor: 'rgba(239,68,68,0.1)' }]}>
          <Ionicons name="trash-outline" size={14} color="#ef4444" />
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 24,
    borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  headerSubtitle: { color: Colors.textMuted, fontSize: 13 },
  addBtn: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  urgentBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14,
    borderRadius: 14, backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1, borderColor: 'rgba(239,68,68,0.25)',
  },
  urgentTitle: { color: '#ef4444', fontWeight: '700', fontSize: 14 },
  urgentDesc: { color: Colors.textMuted, fontSize: 12 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  sectionLabel: { color: Colors.textMuted, fontSize: 12, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingVertical: 60, gap: 8 },
  emptyTitle: { color: '#c4b5fd', fontSize: 16, fontWeight: '700' },
  emptyDesc: { color: Colors.textMuted, fontSize: 13 },
  card: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 12,
    backgroundColor: Colors.card, borderRadius: 16, borderWidth: 1,
  },
  iconBox: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cardTitle: { color: Colors.text, fontSize: 14, fontWeight: '700', flex: 1 },
  cardMessage: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
  cardDate: { fontSize: 12, fontWeight: '600' },
  typeBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginLeft: 4 },
  typeBadgeText: { fontSize: 10, fontWeight: '700' },
  urgentBadge: { backgroundColor: 'rgba(239,68,68,0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  urgentBadgeText: { color: '#ef4444', fontSize: 10, fontWeight: '700' },
  actionBtn: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  // modal
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.7)' },
  modalSheet: {
    backgroundColor: Colors.card, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 20, paddingBottom: 36, maxHeight: '90%',
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
  typeBtn: {
    paddingHorizontal: 16, paddingVertical: 9, borderRadius: 12,
    backgroundColor: '#1e1e3f', borderWidth: 1, borderColor: 'rgba(124,58,237,0.2)',
  },
  typeText: { color: Colors.textMuted, fontWeight: '600', fontSize: 13 },
  switchRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 14, borderRadius: 14, backgroundColor: '#1e1e3f',
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.2)',
  },
  switchDesc: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
  submitBtn: { paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 4 },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
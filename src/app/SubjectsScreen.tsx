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
import { Subject } from '../types';

interface Props {
  subjects: Subject[];
  onAdd: (s: Omit<Subject, 'id' | 'tasks'>) => void;
  onDelete: (id: string) => void;
}

const PALETTE = ['#7c3aed', '#4f46e5', '#2563eb', '#0891b2', '#059669', '#d97706', '#dc2626', '#9333ea'];
const CREDIT_OPTIONS = [2, 3, 4, 5, 6];

export default function SubjectsScreen({ subjects, onAdd, onDelete }: Props) {
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ name: '', professor: '', schedule: '', color: PALETTE[0], credits: 4 });

  const handleAdd = () => {
    if (!form.name.trim()) return;
    onAdd({ ...form });
    setForm({ name: '', professor: '', schedule: '', color: PALETTE[0], credits: 4 });
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1e0a4a', '#13132b']} style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Minhas Matérias</Text>
            <Text style={styles.headerSubtitle}>{subjects.length} matérias cadastradas</Text>
          </View>
          <TouchableOpacity onPress={() => setVisible(true)} style={styles.addBtn}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 14 }}
        showsVerticalScrollIndicator={false}
      >
        {subjects.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={40} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>Nenhuma matéria</Text>
            <Text style={styles.emptyDesc}>Adicione suas matérias do semestre</Text>
          </View>
        ) : (
          subjects.map((s) => (
            <SubjectCard key={s.id} subject={s} onDelete={() => onDelete(s.id)} />
          ))
        )}
      </ScrollView>

      {/* Modal */}
      <Modal visible={visible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nova Matéria</Text>
              <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ gap: 14 }} keyboardShouldPersistTaps="handled">
              <ModalInput label="Nome da matéria" placeholder="Ex: Programação Mobile" value={form.name} onChangeText={(v) => setForm((f) => ({ ...f, name: v }))} />
              <ModalInput label="Professor(a)" placeholder="Nome do professor" value={form.professor} onChangeText={(v) => setForm((f) => ({ ...f, professor: v }))} />
              <ModalInput label="Horário" placeholder="Ex: Seg/Qua 19h–21h" value={form.schedule} onChangeText={(v) => setForm((f) => ({ ...f, schedule: v }))} />

              {/* Credits */}
              <View>
                <Text style={styles.fieldLabel}>Créditos</Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {CREDIT_OPTIONS.map((c) => (
                    <TouchableOpacity
                      key={c}
                      onPress={() => setForm((f) => ({ ...f, credits: c }))}
                      style={[styles.creditBtn, form.credits === c && styles.creditBtnActive]}
                    >
                      <Text style={[styles.creditText, form.credits === c && { color: '#fff' }]}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Color */}
              <View>
                <Text style={styles.fieldLabel}>Cor</Text>
                <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
                  {PALETTE.map((c) => (
                    <TouchableOpacity
                      key={c}
                      onPress={() => setForm((f) => ({ ...f, color: c }))}
                      style={[
                        styles.colorDot,
                        { backgroundColor: c },
                        form.color === c && styles.colorDotSelected,
                      ]}
                    />
                  ))}
                </View>
              </View>

              <TouchableOpacity onPress={handleAdd} activeOpacity={0.85}>
                <LinearGradient colors={['#7c3aed', '#4f46e5']} style={styles.submitBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.submitText}>Adicionar Matéria</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function SubjectCard({ subject, onDelete }: { subject: Subject; onDelete: () => void }) {
  return (
    <View style={[styles.card, { borderColor: `${subject.color}44` }]}>
      <View style={[styles.cardStripe, { backgroundColor: subject.color }]} />
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardName}>{subject.name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 }}>
              <Ionicons name="person-outline" size={12} color={subject.color} />
              <Text style={styles.cardProf}>{subject.professor}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={[styles.creditsBadge, { backgroundColor: `${subject.color}22` }]}>
              <Text style={[styles.creditsBadgeText, { color: subject.color }]}>{subject.credits} cred.</Text>
            </View>
            <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
              <Ionicons name="trash-outline" size={14} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.cardFooter, { borderTopColor: 'rgba(124,58,237,0.1)' }]}>
          <Ionicons name="calendar-outline" size={12} color={subject.color} />
          <Text style={[styles.cardSchedule, { color: subject.color }]}>{subject.schedule}</Text>
          <Text style={[styles.cardSchedule, { color: Colors.textMuted, marginLeft: 'auto' }]}>
            {subject.tasks} tarefa(s)
          </Text>
        </View>
      </View>
    </View>
  );
}

function ModalInput({ label, placeholder, value, onChangeText }: {
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
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  headerSubtitle: { color: Colors.textMuted, fontSize: 13 },
  addBtn: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  emptyState: { alignItems: 'center', paddingVertical: 60, gap: 8 },
  emptyTitle: { color: '#c4b5fd', fontSize: 16, fontWeight: '700' },
  emptyDesc: { color: Colors.textMuted, fontSize: 13 },
  card: {
    backgroundColor: Colors.card, borderRadius: 18, borderWidth: 1,
    flexDirection: 'row', overflow: 'hidden',
  },
  cardStripe: { width: 5 },
  cardBody: { flex: 1, padding: 14 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  cardName: { color: Colors.text, fontSize: 15, fontWeight: '700' },
  cardProf: { color: Colors.textMuted, fontSize: 12 },
  creditsBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  creditsBadgeText: { fontSize: 11, fontWeight: '700' },
  deleteBtn: {
    width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(239,68,68,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  cardFooter: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: 10, paddingTop: 10, borderTopWidth: 1,
  },
  cardSchedule: { fontSize: 12, fontWeight: '500' },
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
  creditBtn: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: '#1e1e3f',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.2)',
  },
  creditBtnActive: { backgroundColor: Colors.primary, borderWidth: 0 },
  creditText: { color: Colors.textMuted, fontWeight: '700', fontSize: 14 },
  colorDot: { width: 32, height: 32, borderRadius: 10 },
  colorDotSelected: { borderWidth: 3, borderColor: '#fff' },
  submitBtn: { paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 4 },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

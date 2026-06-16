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
import { Group } from '../types';

interface Props {
  groups: Group[];
  onAdd: (g: Omit<Group, 'id' | 'members'>) => void;
  onDelete: (id: string) => void;
  currentUser: string;
}

const PALETTE = ['#7c3aed', '#4f46e5', '#2563eb', '#9333ea', '#0891b2', '#059669'];

export default function GroupsScreen({ groups, onAdd, onDelete, currentUser }: Props) {
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ name: '', subject: '', description: '', color: PALETTE[0], nextMeeting: '' });
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleAdd = () => {
    if (!form.name.trim()) return;
    onAdd({ ...form });
    setForm({ name: '', subject: '', description: '', color: PALETTE[0], nextMeeting: '' });
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1e0a4a', '#13132b']} style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Grupos de Estudo</Text>
            <Text style={styles.headerSubtitle}>{groups.length} grupo(s) ativo(s)</Text>
          </View>
          <TouchableOpacity onPress={() => setVisible(true)} style={styles.addBtn}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }} showsVerticalScrollIndicator={false}>
        {groups.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={40} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>Nenhum grupo</Text>
            <Text style={styles.emptyDesc}>Crie grupos de estudo com colegas</Text>
          </View>
        ) : (
          groups.map((g) => (
            <GroupCard
              key={g.id}
              group={g}
              onDelete={() => onDelete(g.id)}
              expanded={expanded === g.id}
              onToggleExpand={() => setExpanded(expanded === g.id ? null : g.id)}
            />
          ))
        )}
      </ScrollView>

      <Modal visible={visible} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Novo Grupo de Estudo</Text>
              <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ gap: 14 }} keyboardShouldPersistTaps="handled">
              <FieldInput label="Nome do grupo" placeholder="Ex: Turma ADS — Mobile" value={form.name} onChangeText={(v) => setForm((f) => ({ ...f, name: v }))} />
              <FieldInput label="Matéria" placeholder="Ex: Programação Mobile" value={form.subject} onChangeText={(v) => setForm((f) => ({ ...f, subject: v }))} />
              <FieldInput label="Descrição" placeholder="Objetivo do grupo..." value={form.description} onChangeText={(v) => setForm((f) => ({ ...f, description: v }))} />
              <FieldInput label="Próximo encontro" placeholder="Ex: Sábado 10h — Biblioteca" value={form.nextMeeting} onChangeText={(v) => setForm((f) => ({ ...f, nextMeeting: v }))} />
              <View>
                <Text style={styles.fieldLabel}>Cor</Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {PALETTE.map((c) => (
                    <TouchableOpacity key={c} onPress={() => setForm((f) => ({ ...f, color: c }))}
                      style={[styles.colorDot, { backgroundColor: c }, form.color === c && styles.colorDotSelected]} />
                  ))}
                </View>
              </View>
              <TouchableOpacity onPress={handleAdd} activeOpacity={0.85}>
                <LinearGradient colors={['#7c3aed', '#4f46e5']} style={styles.submitBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.submitText}>Criar Grupo</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function GroupCard({ group, onDelete, expanded, onToggleExpand }: {
  group: Group; onDelete: () => void; expanded: boolean; onToggleExpand: () => void;
}) {
  return (
    <View style={[styles.card, { borderColor: `${group.color}44` }]}>
      <View style={[styles.cardStripe, { backgroundColor: group.color }]} />
      <View style={{ flex: 1, padding: 14 }}>
        <View style={styles.cardTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardName}>{group.name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 }}>
              <Ionicons name="book-outline" size={12} color={group.color} />
              <Text style={styles.cardSub}>{group.subject}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={14} color="#ef4444" />
          </TouchableOpacity>
        </View>

        {group.description ? (
          <Text style={styles.cardDesc}>{group.description}</Text>
        ) : null}

        {group.nextMeeting ? (
          <View style={[styles.meetingRow, { backgroundColor: `${group.color}18` }]}>
            <Ionicons name="chatbubble-outline" size={13} color={group.color} />
            <Text style={[styles.meetingText, { color: group.color }]}>Próximo: {group.nextMeeting}</Text>
          </View>
        ) : null}

        <View style={styles.cardFooter}>
          {/* Avatars */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {group.members.slice(0, 4).map((m, i) => (
              <View
                key={m.id}
                style={[styles.avatar, { backgroundColor: `hsl(${i * 60 + 240}, 60%, 55%)`, marginLeft: i > 0 ? -8 : 0, zIndex: 4 - i }]}
              >
                <Text style={styles.avatarText}>{m.name[0]}</Text>
              </View>
            ))}
            <Text style={[styles.cardSub, { marginLeft: 8 }]}>{group.members.length} membro(s)</Text>
          </View>
          <TouchableOpacity onPress={onToggleExpand} style={[styles.expandBtn, { backgroundColor: `${group.color}22` }]}>
            <Text style={[styles.expandText, { color: group.color }]}>{expanded ? 'Fechar' : 'Membros'}</Text>
          </TouchableOpacity>
        </View>

        {expanded && (
          <View style={{ marginTop: 12, gap: 8 }}>
            {group.members.map((m, i) => (
              <View key={m.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={[styles.avatar, { backgroundColor: `hsl(${i * 60 + 240}, 60%, 55%)` }]}>
                  <Text style={styles.avatarText}>{m.name[0]}</Text>
                </View>
                <Text style={{ flex: 1, color: Colors.text, fontSize: 13 }}>{m.name}</Text>
                {m.role === 'admin' && (
                  <View style={[styles.adminBadge, { backgroundColor: `${group.color}22` }]}>
                    <Ionicons name="shield-outline" size={11} color={group.color} />
                    <Text style={[styles.adminText, { color: group.color }]}>Admin</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
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
  emptyState: { alignItems: 'center', paddingVertical: 60, gap: 8 },
  emptyTitle: { color: '#c4b5fd', fontSize: 16, fontWeight: '700' },
  emptyDesc: { color: Colors.textMuted, fontSize: 13 },
  card: {
    backgroundColor: Colors.card, borderRadius: 18, borderWidth: 1,
    flexDirection: 'row', overflow: 'hidden',
  },
  cardStripe: { width: 5 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start' },
  cardName: { color: Colors.text, fontSize: 15, fontWeight: '700' },
  cardSub: { color: Colors.textMuted, fontSize: 12 },
  cardDesc: { color: Colors.textMuted, fontSize: 13, marginTop: 8 },
  deleteBtn: {
    width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(239,68,68,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  meetingRow: {
    flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 12, marginTop: 10,
  },
  meetingText: { fontSize: 13, fontWeight: '600' },
  cardFooter: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(124,58,237,0.1)',
  },
  avatar: {
    width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.card,
  },
  avatarText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  expandBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  expandText: { fontSize: 12, fontWeight: '600' },
  adminBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  adminText: { fontSize: 11, fontWeight: '700' },
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
  colorDot: { width: 32, height: 32, borderRadius: 10 },
  colorDotSelected: { borderWidth: 3, borderColor: '#fff' },
  submitBtn: { paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 4 },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
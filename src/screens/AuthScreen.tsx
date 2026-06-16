import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { User } from '../types';

interface Props {
  onLogin: (user: User) => void;
}

export default function AuthScreen({ onLogin }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', course: '', password: '' });

  const handleSubmit = () => {
    onLogin({
      name: form.name || 'Ana Beatriz',
      email: form.email || 'ana.beatriz@email.com',
      course: form.course || 'Análise e Desenvolvimento de Sistemas',
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        {/* Hero */}
        <LinearGradient colors={['#1e0a4a', '#1a1060', '#0d0d1a']} style={styles.hero}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBox}>
              <Ionicons name="school" size={36} color="#c4b5fd" />
            </View>
            <Text style={styles.appName}>UniPlanner</Text>
            <Text style={styles.appTagline}>Organize sua vida acadêmica em um só lugar</Text>
          </View>
        </LinearGradient>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Tabs */}
          <View style={styles.tabContainer}>
            {(['login', 'register'] as const).map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setMode(t)}
                style={[styles.tab, mode === t && styles.tabActive]}
              >
                <Text style={[styles.tabText, mode === t && styles.tabTextActive]}>
                  {t === 'login' ? 'Entrar' : 'Cadastrar'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {mode === 'register' && (
            <InputField
              icon="person-outline"
              placeholder="Nome completo"
              value={form.name}
              onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
            />
          )}

          <InputField
            icon="mail-outline"
            placeholder="E-mail"
            value={form.email}
            onChangeText={(v) => setForm((f) => ({ ...f, email: v }))}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {mode === 'register' && (
            <InputField
              icon="book-outline"
              placeholder="Curso (ex: ADS)"
              value={form.course}
              onChangeText={(v) => setForm((f) => ({ ...f, course: v }))}
            />
          )}

          <View style={styles.passwordRow}>
            <InputField
              icon="lock-closed-outline"
              placeholder="Senha"
              value={form.password}
              onChangeText={(v) => setForm((f) => ({ ...f, password: v }))}
              secureTextEntry={!showPass}
              style={{ flex: 1 }}
            />
            <TouchableOpacity
              onPress={() => setShowPass(!showPass)}
              style={styles.eyeBtn}
            >
              <Ionicons
                name={showPass ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          {mode === 'login' && (
            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Esqueceu a senha?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={handleSubmit} activeOpacity={0.85}>
            <LinearGradient colors={['#7c3aed', '#4f46e5']} style={styles.submitBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={styles.submitText}>
                {mode === 'login' ? 'Entrar no UniPlanner' : 'Criar conta'}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.footer}>UNINASSAU · ADS — Backend, BD & Mobile</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function InputField({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  style,
}: {
  icon: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: any;
  autoCapitalize?: any;
  style?: any;
}) {
  return (
    <View style={[styles.inputContainer, style]}>
      <Ionicons name={icon as any} size={16} color={Colors.primary} style={{ marginRight: 10 }} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize ?? 'sentences'}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  hero: {
    minHeight: 280,
    justifyContent: 'flex-end',
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    gap: 10,
  },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(124,58,237,0.25)',
    borderWidth: 1.5,
    borderColor: 'rgba(124,58,237,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 8,
  },
  appTagline: {
    color: '#a78bfa',
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 220,
  },
  formContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 32,
    gap: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1a1a35',
    borderRadius: 14,
    padding: 4,
    marginBottom: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 11,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    color: Colors.textMuted,
    fontWeight: '600',
    fontSize: 14,
  },
  tabTextActive: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e3f',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.2)',
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: 15,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eyeBtn: {
    width: 48,
    height: 52,
    backgroundColor: '#1e1e3f',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.2)',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: -6,
  },
  forgotText: {
    color: '#a78bfa',
    fontSize: 13,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: Colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  submitText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  footer: {
    color: Colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
});
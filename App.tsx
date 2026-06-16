import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { User, Task, Subject, Group, Reminder, TabName } from './src/types';
import AuthScreen from './src/app/AuthScreen';
import HomeScreen from './src/app/HomeScreen';
import SubjectsScreen from './src/app/SubjectsScreen';
import TasksScreen from './src/app/TasksScreen';
import GroupsScreen from './src/app/GroupsScreen';
import RemindersScreen from './src/app/RemindersScreen';
import ProfileScreen from './src/app/ProfileScreen';
import { BottomNav } from './src/components/BottomNav';

let _id = 100;
const uid = () => String(++_id);

const INITIAL_SUBJECTS: Subject[] = [
  { id: 's1', name: 'Programação Mobile', color: '#7c3aed', professor: 'Prof. Carlos Lima', schedule: 'Ter/Qui 19h', tasks: 2, credits: 4 },
  { id: 's2', name: 'Banco de Dados II', color: '#4f46e5', professor: 'Profa. Fernanda Mota', schedule: 'Seg/Qua 18h', tasks: 3, credits: 3 },
  { id: 's3', name: 'Backend com Node.js', color: '#2563eb', professor: 'Prof. Rafael Costa', schedule: 'Sex 19h30', tasks: 1, credits: 4 },
  { id: 's4', name: 'Eng. de Software', color: '#9333ea', professor: 'Profa. Juliana Paz', schedule: 'Qua 20h', tasks: 2, credits: 3 },
];

const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Lista de exercícios - Joins SQL', subject: 'Banco de Dados II', dueDate: '20/06/2025', priority: 'alta', type: 'tarefa', done: false },
  { id: 't2', title: 'Prova P1 — Mobile', subject: 'Programação Mobile', dueDate: '25/06/2025', priority: 'alta', type: 'prova', done: false },
  { id: 't3', title: 'Trabalho: API REST com Express', subject: 'Backend com Node.js', dueDate: '30/06/2025', priority: 'média', type: 'trabalho', done: false },
  { id: 't4', title: 'Diagrama ER do projeto', subject: 'Banco de Dados II', dueDate: '18/06/2025', priority: 'média', type: 'tarefa', done: true },
  { id: 't5', title: 'Protótipo no Figma', subject: 'Eng. de Software', dueDate: '22/06/2025', priority: 'baixa', type: 'trabalho', done: false },
];

const INITIAL_GROUPS: Group[] = [
  {
    id: 'g1',
    name: 'Turma ADS — Mobile',
    subject: 'Programação Mobile',
    description: 'Dúvidas e materiais de React Native',
    color: '#7c3aed',
    nextMeeting: 'Sábado 10h — Biblioteca',
    members: [
      { id: 'm1', name: 'Ana Beatriz', role: 'admin' },
      { id: 'm2', name: 'Lucas Souza', role: 'membro' },
      { id: 'm3', name: 'Mariana Alves', role: 'membro' },
    ],
  },
  {
    id: 'g2',
    name: 'BD Avançado',
    subject: 'Banco de Dados II',
    description: 'Estudos para P1 e P2 de BD',
    color: '#4f46e5',
    nextMeeting: 'Quinta 19h — Online (Meet)',
    members: [
      { id: 'm4', name: 'Ana Beatriz', role: 'admin' },
      { id: 'm5', name: 'Felipe Santos', role: 'membro' },
    ],
  },
];

const INITIAL_REMINDERS: Reminder[] = [
  { id: 'r1', title: 'Entrega da lista de BD', message: 'Enviar no SIGAA até meia-noite', date: '20/06/2025', time: '22:00', type: 'prazo', active: true, urgent: true },
  { id: 'r2', title: 'Prova P1 — Programação Mobile', message: 'Revisar Hooks e Context API', date: '25/06/2025', time: '19:00', type: 'prova', active: true, urgent: false },
  { id: 'r3', title: 'Reunião grupo BD', message: 'Google Meet — link no WhatsApp', date: '19/06/2025', time: '19:00', type: 'reunião', active: true, urgent: false },
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<TabName>('home');
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [reminders, setReminders] = useState<Reminder[]>(INITIAL_REMINDERS);

  if (!user) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <AuthScreen onLogin={setUser} />
      </SafeAreaProvider>
    );
  }

  const urgentCount = reminders.filter((r) => r.active && r.urgent).length;

  const renderScreen = () => {
    switch (tab) {
      case 'home':
        return <HomeScreen user={user} tasks={tasks} subjects={subjects} onNavigate={setTab} />;
      case 'materias':
        return (
          <SubjectsScreen
            subjects={subjects}
            onAdd={(s) => setSubjects((p) => [...p, { ...s, id: uid(), tasks: 0 }])}
            onDelete={(id) => setSubjects((p) => p.filter((s) => s.id !== id))}
          />
        );
      case 'tarefas':
        return (
          <TasksScreen
            tasks={tasks}
            subjects={subjects}
            onAdd={(t) => setTasks((p) => [...p, { ...t, id: uid(), done: false }])}
            onToggle={(id) => setTasks((p) => p.map((t) => t.id === id ? { ...t, done: !t.done } : t))}
            onDelete={(id) => setTasks((p) => p.filter((t) => t.id !== id))}
          />
        );
      case 'grupos':
        return (
          <GroupsScreen
            groups={groups}
            onAdd={(g) =>
              setGroups((p) => [
                ...p,
                { ...g, id: uid(), members: [{ id: uid(), name: user.name, role: 'admin' }] },
              ])
            }
            onDelete={(id) => setGroups((p) => p.filter((g) => g.id !== id))}
            currentUser={user.name}
          />
        );
      case 'lembretes':
        return (
          <RemindersScreen
            reminders={reminders}
            onAdd={(r) => setReminders((p) => [...p, { ...r, id: uid() }])}
            onToggle={(id) => setReminders((p) => p.map((r) => r.id === id ? { ...r, active: !r.active } : r))}
            onDelete={(id) => setReminders((p) => p.filter((r) => r.id !== id))}
          />
        );
      case 'perfil':
        return (
          <ProfileScreen
            user={user}
            stats={{
              subjects: subjects.length,
              tasks: tasks.length,
              doneTasks: tasks.filter((t) => t.done).length,
              groups: groups.length,
              reminders: reminders.length,
            }}
            onLogout={() => setUser(null)}
          />
        );
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.screen}>{renderScreen()}</View>
        <BottomNav active={tab} onChange={setTab} urgentCount={urgentCount} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0d0d1a',
  },
  screen: {
    flex: 1,
  },
});
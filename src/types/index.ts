export interface User {
  name: string;
  email: string;
  course: string;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  professor: string;
  schedule: string;
  tasks: number;
  credits: number;
}

export interface Task {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: 'alta' | 'média' | 'baixa';
  type: 'tarefa' | 'prova' | 'trabalho';
  done: boolean;
  description?: string;
}

export interface Member {
  id: string;
  name: string;
  role: 'admin' | 'membro';
}

export interface Group {
  id: string;
  name: string;
  subject: string;
  members: Member[];
  description: string;
  color: string;
  nextMeeting?: string;
}

export interface Reminder {
  id: string;
  title: string;
  message: string;
  date: string;
  time: string;
  type: 'prazo' | 'prova' | 'reunião' | 'outro';
  active: boolean;
  urgent: boolean;
}

export type TabName = 'home' | 'materias' | 'tarefas' | 'grupos' | 'lembretes' | 'perfil';
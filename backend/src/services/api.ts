import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = ' http://localhost:3000/api';

async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem('@uniplanner:token');
}

async function request<T>(
  method: string,
  path: string,
  body?: object
): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Erro na requisição');
  return data as T;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export const AuthService = {
  async register(payload: { name: string; email: string; course: string; password: string }) {
    const data = await request<{ token: string; user: object }>('POST', '/auth/register', payload);
    await AsyncStorage.setItem('@uniplanner:token', data.token);
    return data;
  },

  async login(email: string, password: string) {
    const data = await request<{ token: string; user: object }>('POST', '/auth/login', { email, password });
    await AsyncStorage.setItem('@uniplanner:token', data.token);
    return data;
  },

  async me() {
    return request<object>('GET', '/auth/me');
  },

  async logout() {
    await AsyncStorage.removeItem('@uniplanner:token');
  },
};

// ─── Subjects ────────────────────────────────────────────────────────────────

export const SubjectsService = {
  list: () => request<object[]>('GET', '/subjects'),
  get: (id: string) => request<object>('GET', `/subjects/${id}`),
  create: (body: object) => request<object>('POST', '/subjects', body),
  update: (id: string, body: object) => request<object>('PUT', `/subjects/${id}`, body),
  remove: (id: string) => request<void>('DELETE', `/subjects/${id}`),
};

// ─── Tasks ───────────────────────────────────────────────────────────────────

export const TasksService = {
  list: (params?: { type?: string; priority?: string; done?: boolean; subject_id?: string }) => {
    const qs = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    return request<object[]>('GET', `/tasks${qs}`);
  },
  get: (id: string) => request<object>('GET', `/tasks/${id}`),
  create: (body: object) => request<object>('POST', '/tasks', body),
  update: (id: string, body: object) => request<object>('PUT', `/tasks/${id}`, body),
  toggle: (id: string) => request<object>('PATCH', `/tasks/${id}/toggle`),
  remove: (id: string) => request<void>('DELETE', `/tasks/${id}`),
};

// ─── Groups ──────────────────────────────────────────────────────────────────

export const GroupsService = {
  list: () => request<object[]>('GET', '/groups'),
  get: (id: string) => request<object>('GET', `/groups/${id}`),
  create: (body: object) => request<object>('POST', '/groups', body),
  update: (id: string, body: object) => request<object>('PUT', `/groups/${id}`, body),
  remove: (id: string) => request<void>('DELETE', `/groups/${id}`),
  addMember: (groupId: string, email: string) =>
    request<object>('POST', `/groups/${groupId}/members`, { email }),
  removeMember: (groupId: string, userId: string) =>
    request<void>('DELETE', `/groups/${groupId}/members/${userId}`),
};

// ─── Reminders ───────────────────────────────────────────────────────────────

export const RemindersService = {
  list: (params?: { active?: boolean; urgent?: boolean }) => {
    const qs = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    return request<object[]>('GET', `/reminders${qs}`);
  },
  get: (id: string) => request<object>('GET', `/reminders/${id}`),
  create: (body: object) => request<object>('POST', '/reminders', body),
  update: (id: string, body: object) => request<object>('PUT', `/reminders/${id}`, body),
  toggle: (id: string) => request<object>('PATCH', `/reminders/${id}/toggle`),
  remove: (id: string) => request<void>('DELETE', `/reminders/${id}`),
};

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import subjectsRoutes from './routes/subjects';
import tasksRoutes from './routes/tasks';
import groupsRoutes from './routes/groups';
import remindersRoutes from './routes/reminders';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', app: 'UniPlanner API', version: '1.0.0' });
});

// Rotas
app.use('/auth', authRoutes);
app.use('/subjects', subjectsRoutes);
app.use('/tasks', tasksRoutes);
app.use('/groups', groupsRoutes);
app.use('/reminders', remindersRoutes);

// 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
  console.log(`UniPlanner API rodando em http://localhost:8081`);
});

export default app;

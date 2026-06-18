import { Router, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { randomUUID } from 'crypto';
import pool from '../database/db';
import { requireAuth, AuthReq } from '../middleware/auth';

const router = Router();
router.use(requireAuth);

interface SubjectRow extends RowDataPacket {
  id: string; name: string; color: string; professor: string;
  schedule: string; credits: number; tasks: number;
}

function toSubject(row: SubjectRow) {
  return {
    id:        row.id,
    name:      row.name,
    color:     row.color,
    professor: row.professor,
    schedule:  row.schedule,
    credits:   row.credits,
    tasks:     Number(row.tasks ?? 0),
  };
}

// GET /subjects
router.get('/', async (req: AuthReq, res: Response) => {
  try {
    const [rows] = await pool.query<SubjectRow[]>(
      `SELECT s.*,
         (SELECT COUNT(*) FROM tasks t
          WHERE t.user_id = s.user_id AND t.subject = s.name) AS tasks
       FROM subjects s
       WHERE s.user_id = ?
       ORDER BY s.created_at DESC`,
      [req.userId]
    );
    return res.json(rows.map(toSubject));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar matérias' });
  }
});

// GET /subjects/:id
router.get('/:id', async (req: AuthReq, res: Response) => {
  try {
    const [rows] = await pool.query<SubjectRow[]>(
      `SELECT s.*,
         (SELECT COUNT(*) FROM tasks t
          WHERE t.user_id = s.user_id AND t.subject = s.name) AS tasks
       FROM subjects s
       WHERE s.id = ? AND s.user_id = ?`,
      [req.params.id, req.userId]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Matéria não encontrada' });
    return res.json(toSubject(rows[0]));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar matéria' });
  }
});

// POST /subjects
router.post('/', async (req: AuthReq, res: Response) => {
  const { name, color, professor, schedule, credits } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'name é obrigatório' });

  const id = randomUUID();
  try {
    await pool.query<ResultSetHeader>(
      'INSERT INTO subjects (id, user_id, name, color, professor, schedule, credits) VALUES (?,?,?,?,?,?,?)',
      [id, req.userId, name, color ?? '#7c3aed', professor ?? '', schedule ?? '', credits ?? 4]
    );
    const [rows] = await pool.query<SubjectRow[]>(
      `SELECT s.*, 0 AS tasks FROM subjects s WHERE s.id = ?`, [id]
    );
    return res.status(201).json(toSubject(rows[0]));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao criar matéria' });
  }
});

// PUT /subjects/:id
router.put('/:id', async (req: AuthReq, res: Response) => {
  const { name, color, professor, schedule, credits } = req.body;
  try {
    // Monta SET dinâmico só com campos enviados
    const sets: string[] = [];
    const vals: unknown[] = [];
    if (name      !== undefined) { sets.push('name = ?');      vals.push(name); }
    if (color     !== undefined) { sets.push('color = ?');     vals.push(color); }
    if (professor !== undefined) { sets.push('professor = ?'); vals.push(professor); }
    if (schedule  !== undefined) { sets.push('schedule = ?');  vals.push(schedule); }
    if (credits   !== undefined) { sets.push('credits = ?');   vals.push(credits); }

    if (!sets.length) return res.status(400).json({ error: 'Nenhum campo para atualizar' });

    vals.push(req.params.id, req.userId);
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE subjects SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`,
      vals
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Matéria não encontrada' });

    const [rows] = await pool.query<SubjectRow[]>(
      `SELECT s.*,
         (SELECT COUNT(*) FROM tasks t WHERE t.user_id = s.user_id AND t.subject = s.name) AS tasks
       FROM subjects s WHERE s.id = ?`,
      [req.params.id]
    );
    return res.json(toSubject(rows[0]));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao atualizar matéria' });
  }
});

// DELETE /subjects/:id
router.delete('/:id', async (req: AuthReq, res: Response) => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM subjects WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Matéria não encontrada' });
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao deletar matéria' });
  }
});

export default router;

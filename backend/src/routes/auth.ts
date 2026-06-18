import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../database/db';
import { requireAuth, AuthReq } from '../middleware/auth';

const router = Router();

function makeToken(userId: string, userName: string) {
  const secret = process.env.JWT_SECRET as Secret;
  const options: SignOptions = { expiresIn: (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) ?? '7d' };
  return jwt.sign({ userId, userName }, secret, options);
}

// POST /auth/register
router.post('/register', async (req: Request, res: Response) => {
  const { name, email, course, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email e password são obrigatórios' });
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    if (rows.length) return res.status(409).json({ error: 'E-mail já cadastrado' });

    const id   = randomUUID();
    const hash = await bcrypt.hash(password, 10);

    await pool.query<ResultSetHeader>(
      'INSERT INTO users (id, name, email, course, password) VALUES (?, ?, ?, ?, ?)',
      [id, name, email, course ?? '', hash]
    );

    return res.status(201).json({
      token: makeToken(id, name),
      user: { name, email, course: course ?? '' },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /auth/login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email e password são obrigatórios' });
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password as string))) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    return res.json({
      token: makeToken(user.id as string, user.name as string),
      user: { name: user.name, email: user.email, course: user.course },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /auth/me
router.get('/me', requireAuth, async (req: AuthReq, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT name, email, course FROM users WHERE id = ?',
      [req.userId]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Usuário não encontrado' });
    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;

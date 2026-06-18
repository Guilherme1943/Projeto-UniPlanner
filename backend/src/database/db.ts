import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host:               process.env.DB_HOST     ?? 'localhost',
  port:               Number(process.env.DB_PORT) || 3306,
  database:           process.env.DB_NAME     ?? 'uniplanner',
  user:               process.env.DB_USER     ?? 'root',
  password:           process.env.DB_PASSWORD ?? '',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  namedPlaceholders: false,
  typeCast(field, next) {
    if (field.type === 'TINY' && field.length === 1) {
      return field.string() === '1';
    }
    return next();
  },
});

// Testa a conexão na inicialização
pool.getConnection().then((conn) => {
  console.log('✅ MySQL conectado');
  conn.release();
}).catch((err: Error) => {
  console.error('❌ Erro ao conectar ao MySQL:', err.message);
  process.exit(1);
});

export default pool;
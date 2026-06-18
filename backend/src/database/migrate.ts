import pool from './db';

const STATEMENTS = [
  `CREATE TABLE USUARIO (
    id_usuario INT AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL, -- VARCHAR longo pensando em hash de criptografia
    data_cadastro DATETIME NOT NULL,
    CONSTRAINT PK_USUARIO PRIMARY KEY (id_usuario)
);`,

  `CREATE TABLE DISCIPLINA (
    id_disciplina INT AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    id_usuario INT NOT NULL,
    CONSTRAINT PK_DISCIPLINA PRIMARY KEY (id_disciplina),
    CONSTRAINT FK_DISCIPLINA_USUARIO FOREIGN KEY (id_usuario) 
        REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
);`,

  `CREATE TABLE ATIVIDADE_ACADEMICA (
    id_atividade INT AUTO_INCREMENT,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT, -- TEXT permite descrições mais longas que VARCHAR
    tipo VARCHAR(50) NOT NULL, -- Ex: 'Tarefa', 'Trabalho', 'Prova'
    data_entrega DATETIME NOT NULL,
    prioridade VARCHAR(50) NOT NULL, -- Ex: 'Alta', 'Média', 'Baixa'
    id_disciplina INT NOT NULL,
    CONSTRAINT PK_ATIVIDADE PRIMARY KEY (id_atividade),
    CONSTRAINT FK_ATIVIDADE_DISCIPLINA FOREIGN KEY (id_disciplina) 
        REFERENCES DISCIPLINA(id_disciplina) ON DELETE CASCADE
);`,

  `CREATE TABLE GRUPO_DE_ESTUDO (
    id_grupo INT AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    data_criacao DATETIME NOT NULL,
    CONSTRAINT PK_GRUPO PRIMARY KEY (id_grupo)
);`,

  `CREATE TABLE PARTICIPACAO_GRUPO (
    id_usuario INT NOT NULL,
    id_grupo INT NOT NULL,
    data_entrada DATETIME NOT NULL,
    cargo VARCHAR(50) NOT NULL, -- Ex: 'Criador' ou 'Membro'
    CONSTRAINT PK_PARTICIPACAO_GRUPO PRIMARY KEY (id_usuario, id_grupo), -- Chave composta
    CONSTRAINT FK_PARTICIPACAO_USUARIO FOREIGN KEY (id_usuario) 
        REFERENCES USUARIO(id_usuario) ON DELETE CASCADE,
    CONSTRAINT FK_PARTICIPACAO_GRUPO FOREIGN KEY (id_grupo) 
        REFERENCES GRUPO_DE_ESTUDO(id_grupo) ON DELETE CASCADE
);`,

  `CREATE TABLE LEMBRETE (
    id_lembrete INT AUTO_INCREMENT,
    mensagem VARCHAR(255) NOT NULL,
    data_notificacao DATETIME NOT NULL,
    status VARCHAR(50) NOT NULL, -- Ex: 'Pendente', 'Enviado'
    id_usuario INT NOT NULL,
    id_atividade INT NOT NULL,
    CONSTRAINT PK_LEMBRETE PRIMARY KEY (id_lembrete),
    CONSTRAINT FK_LEMBRETE_USUARIO FOREIGN KEY (id_usuario) 
        REFERENCES USUARIO(id_usuario) ON DELETE CASCADE,
    CONSTRAINT FK_LEMBRETE_ATIVIDADE FOREIGN KEY (id_atividade) 
        REFERENCES ATIVIDADE_ACADEMICA(id_atividade) ON DELETE CASCADE
);`,
];

(async () => {
  const conn = await pool.getConnection();
  try {
    for (const sql of STATEMENTS) {
      await conn.query(sql);
    }
    console.log('✅ Migrações MySQL aplicadas com sucesso');
  } catch (err) {
    console.error('Erro na migração:', err);
    process.exit(1);
  } finally {
    conn.release();
    await pool.end();
  }
})();
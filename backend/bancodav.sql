-- =========================
-- TABELA CLIENTES
-- =========================
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    cpf TEXT,
    nome TEXT,
    fantasia TEXT,
    endereco TEXT,
    email TEXT,
    telefone TEXT,
    celular TEXT,
    limite REAL,
    cep TEXT,
    bairro TEXT
);

-- =========================
-- TABELA ITENS (PRODUTOS)
-- =========================
CREATE TABLE IF NOT EXISTS itens (
    controle SERIAL PRIMARY KEY,
    codbarras TEXT,
    nome TEXT,
    descricao TEXT,
    grupo TEXT,
    marca TEXT,
    aplicacao TEXT,
    duracao NUMERIC(5,2),
    tipo TEXT,
    categoria TEXT,
    quantidade REAL,
    precocusto REAL,
    perlucro REAL,
    precovenda REAL,
    revenda REAL
);

-- =========================
-- TABELA ORCAMENTOS
-- =========================
CREATE TABLE IF NOT EXISTS orcamentos (
    id SERIAL PRIMARY KEY,
    numero TEXT UNIQUE,
    clienteid INTEGER,
    datacriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    validade TEXT,
    observacoes TEXT,
    desconto REAL DEFAULT 0,
    acrescimo REAL DEFAULT 0,
    valortotalitens REAL DEFAULT 0,
    valortotal REAL DEFAULT 0,
    status TEXT DEFAULT 'ABERTO',
    condicao TEXT,
    CONSTRAINT fk_orcamento_cliente
        FOREIGN KEY (clienteid) REFERENCES clientes(id)
);

-- =========================
-- TABELA ITENS DO ORCAMENTO
-- =========================
CREATE TABLE IF NOT EXISTS itensorcamento (
    id SERIAL PRIMARY KEY,
    orcamentoid INTEGER NOT NULL,
    produtoid INTEGER,
    descricao TEXT,
    quantidade REAL NOT NULL,
    valorunit REAL NOT NULL,
    total REAL NOT NULL,
    tipoitem TEXT DEFAULT 'PRODUTO',
    CONSTRAINT fk_item_orcamento
        FOREIGN KEY (orcamentoid) REFERENCES orcamentos(id),
    CONSTRAINT fk_item_produto
        FOREIGN KEY (produtoid) REFERENCES itens(controle)
);

CREATE TABLE IF NOT EXISTS objetosveiculos (
  id SERIAL PRIMARY KEY,                          -- Usando SERIAL para autoincremento no PostgreSQL
  clienteid INTEGER NOT NULL,
  tipo TEXT NOT NULL,                             -- Ex: Veículo, Impressora, Ar-condicionado, etc.
  marca TEXT,
  modelo TEXT,
  ano TEXT,
  cor TEXT,
  placaserie TEXT,
  numeroserie TEXT,
  status TEXT DEFAULT 'ATIVO',                    -- ATIVO, INATIVO, EM REPARO, etc.
  observacoes TEXT,
  ativo TEXT DEFAULT 'SIM',
  datacadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (clienteid) REFERENCES clientes(id)
);

-- =========================
-- TABELA ORDEM SERVIÇO
-- =========================
CREATE TABLE IF NOT EXISTS ordemservico (
  id SERIAL PRIMARY KEY,                          -- Usando SERIAL para autoincremento no PostgreSQL
  numeroos TEXT UNIQUE,                           -- Número visível para controle (ex: OS0001)
  clienteid INTEGER NOT NULL,
  objetoveiculoid INTEGER,  
  laudo TEXT,                                     -- Ex: Manutenção, Instalação, Revisão
  dataabertura TEXT NOT NULL,
  datafinalizacao TEXT,
  status TEXT NOT NULL DEFAULT 'ABERTA',         -- ABERTA, EM ANDAMENTO, FINALIZADA, CANCELADA
  descricao TEXT,
  observacoes TEXT,
  garantia TEXT,
  desconto REAL DEFAULT 0,
  acrescimo REAL DEFAULT 0,
  valortotalitem REAL DEFAULT 0,
  valortotalserv REAL DEFAULT 0,
  valortotal REAL DEFAULT 0,
  formapagamento TEXT,
  datacadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  adiantamento REAL DEFAULT 0,
  FOREIGN KEY (clienteid) REFERENCES clientes(id),
  FOREIGN KEY (objetoveiculoid) REFERENCES objetosveiculos(id)  
);

-- =========================
-- TABELA ITENS DA ORDEM DE SERVIÇO
-- =========================
CREATE TABLE IF NOT EXISTS itensordemservico (
  id SERIAL PRIMARY KEY,                          -- Usando SERIAL para autoincremento no PostgreSQL
  ordemservicoid INTEGER NOT NULL,
  produtoid INTEGER,
  descricao TEXT,
  tipoitem TEXT DEFAULT 'PRODUTO',                -- PRODUTO ou SERVIÇO
  quantidade REAL NOT NULL,
  valorunitario REAL NOT NULL,
  total REAL NOT NULL,
  tecnico TEXT,
  FOREIGN KEY (ordemservicoid) REFERENCES ordemservico(id),
  FOREIGN KEY (produtoid) REFERENCES itens(controle)
);

-- =========================
-- TABELA OBJETOS VEÍCULOS
-- =========================

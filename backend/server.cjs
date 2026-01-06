// ==========================================
//  SERVER.CJS - API PostgreSQL
// ==========================================

// ==========================================
//  IMPORTS
// ==========================================
const fs = require('fs')
const path = require('path')
const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

// ==========================================
//  CONFIGURAÇÕES DO EXPRESS
// ==========================================
const app = express()
app.use(cors()) // permite requisições de qualquer origem
app.use(express.json()) // permite receber JSON no body

// ==========================================
//  CONEXÃO COM POSTGRES
// ==========================================
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bancodav', // banco deve existir!
  password: '8451',
  port: 5432,
})

// ==========================================
//  FUNÇÃO PARA CARREGAR banco.sql
// ==========================================
async function carregarBanco() {
  try {
    const sqlPath = path.join(__dirname, 'bancodav.sql')
    console.log('📄 Lendo arquivo SQL:', sqlPath)

    if (!fs.existsSync(sqlPath)) {
      console.warn('⚠️ bancodav.sql não encontrado, pulando execução...')
      return
    }

    const sql = fs.readFileSync(sqlPath, 'utf8')
    console.log('⏳ Executando bancodav.sql...')
    await pool.query(sql)
    console.log('✔️ bancodav.sql executado com sucesso!')
  } catch (err) {
    console.error('❌ Erro ao executar bancodav.sql\n', err)
  }
}

// ==========================================
//  ROTAS
// ==========================================
// ROTA PRINCIPAL
// ==========================
// ROTAS CLIENTES
// ==========================

// Listar clientes
app.get('/clientes', async (_, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM clientes ORDER BY id DESC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Criar cliente
app.post('/clientes', async (req, res) => {
  const {
    cpf,
    nome,
    fantasia,
    endereco,
    cep,
    bairro,
    email,
    telefone,
    celular,
    limite,
    objetos, // ← opcional
  } = req.body

  if (!cpf || !nome) {
    return res.status(400).json({
      erro: 'CPF e nome são obrigatórios',
    })
  }

  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // 🔹 1) INSERE CLIENTE (independente de objetos)
    const resultCliente = await client.query(
      `
      INSERT INTO clientes (
        cpf,
        nome,
        fantasia,
        endereco,
        cep,
        bairro,
        email,
        telefone,
        celular,
        limite
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING id
      `,
      [
        cpf,
        nome,
        fantasia || null,
        endereco || null,
        cep || null,
        bairro || null,
        email || null,
        telefone || null,
        celular || null,
        limite || 0,
      ],
    )

    const clienteid = resultCliente.rows[0].id

    // 🔹 2) INSERE OBJETOS SOMENTE SE EXISTIREM
    if (Array.isArray(objetos) && objetos.length > 0) {
      const sqlObjeto = `
        INSERT INTO objetosveiculos (
          clienteid,
          tipo,
          marca,
          modelo,
          ano,
          cor,
          placaserie,
          observacoes,
          ativo
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      `

      for (const obj of objetos) {
        await client.query(sqlObjeto, [
          clienteid,
          obj.tipo || 'OUTRO',
          obj.marca || null,
          obj.modelo || null,
          obj.ano || null,
          obj.cor || null,
          obj.placaSerie || null,
          obj.observacoes || null,
          'SIM',
        ])
      }
    }

    await client.query('COMMIT')

    // 🔹 3) RESPOSTA ÚNICA (com ou sem objetos)
    res.status(201).json({
      sucesso: true,
      id: clienteid,
    })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Erro ao salvar cliente:', err.message)

    if (err.code === '23505') {
      return res.status(409).json({
        erro: 'Cliente já cadastrado',
      })
    }

    res.status(500).json({ erro: err.message })
  } finally {
    client.release()
  }
})

// Atualizar cliente
app.put('/clientes/:id', async (req, res) => {
  const { id } = req.params
  const { cpf, nome, fantasia, endereco, cep, bairro, email, telefone, celular, limite } = req.body
  try {
    await pool.query(
      `UPDATE clientes
       SET cpf=$1, nome=$2, fantasia=$3, endereco=$4, cep=$5, bairro=$6,
           email=$7, telefone=$8, celular=$9, limite=$10
       WHERE id=$11`,
      [cpf, nome, fantasia, endereco, cep, bairro, email, telefone, celular, limite, id],
    )
    res.sendStatus(200)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Deletar cliente
app.delete('/clientes/:id', async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM clientes WHERE id=$1', [id])
    res.sendStatus(200)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ==========================
// ROTAS ITENS
// ==========================

// Listar itens
app.get('/itens', async (_, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT *
       FROM itens
       WHERE aplicacao = 'PRODUTO'
       ORDER BY controle asc`,
    )

    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/servicos', async (_, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT *
       FROM itens
       WHERE aplicacao = 'SERVICO'
       ORDER BY controle asc`,
    )

    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Criar item
app.post('/itens', async (req, res) => {
  try {
    let {
      codbarras,
      nome,
      descricao,
      grupo,
      marca,
      quantidade,
      precocusto,
      perlucro,
      precovenda,
      revenda,
    } = req.body

    // 🔹 força aplicação
    const aplicacao = 'PRODUTO'

    // 🔹 validações mínimas
    if (!nome || !precovenda) {
      return res.status(400).json({
        error: 'Nome e preço de venda são obrigatórios',
      })
    }

    quantidade = Number(quantidade) || 0
    precocusto = Number(precocusto) || 0
    perlucro = Number(perlucro) || 0
    precovenda = Number(precovenda)
    revenda = Number(revenda) || 0

    if (quantidade <= 0) {
      return res.status(400).json({
        error: 'Produto exige quantidade em estoque',
      })
    }

    const result = await pool.query(
      `INSERT INTO itens
       (codbarras, nome, descricao, grupo, marca, aplicacao,
        quantidade, precocusto, perlucro, precovenda, revenda)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING controle`,
      [
        codbarras,
        nome,
        descricao,
        grupo,
        marca,
        aplicacao,
        quantidade,
        precocusto,
        perlucro,
        precovenda,
        revenda,
      ],
    )

    res.status(201).json({ controle: result.rows[0].controle })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

app.post('/servicos', async (req, res) => {
  try {
    const {
      nome,
      duracao, // deve chegar REAL
      tipo,
      categoria,
      precovenda,
    } = req.body

    const aplicacao = 'SERVICO'

    if (!nome || precovenda === undefined) {
      return res.status(400).json({
        error: 'Nome e preço de venda são obrigatórios',
      })
    }

    const precoVendaReal = Number(precovenda)
    if (isNaN(precoVendaReal) || precoVendaReal <= 0) {
      return res.status(400).json({ error: 'Preço inválido' })
    }

    let duracaoReal = null
    if (duracao !== undefined && duracao !== null && duracao !== '') {
      duracaoReal = Number(duracao)

      if (isNaN(duracaoReal) || duracaoReal <= 0) {
        return res.status(400).json({
          error: 'Duração inválida',
        })
      }
    }

    const result = await pool.query(
      `INSERT INTO itens
       (nome, duracao, tipo, categoria, aplicacao, precovenda)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING controle`,
      [
        nome.trim().toUpperCase(),
        duracaoReal, // REAL correto
        tipo || null,
        categoria || null,
        aplicacao,
        precoVendaReal,
      ],
    )

    res.status(201).json({ controle: result.rows[0].controle })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

app.put('/servicos/:controle', async (req, res) => {
  try {
    const { controle } = req.params

    const {
      nome,
      duracao, // REAL
      tipo,
      categoria,
      precovenda,
    } = req.body

    if (!controle) {
      return res.status(400).json({ error: 'Controle não informado' })
    }

    if (!nome || precovenda === undefined) {
      return res.status(400).json({
        error: 'Nome e preço de venda são obrigatórios',
      })
    }

    const precoVendaReal = Number(precovenda)
    if (isNaN(precoVendaReal) || precoVendaReal <= 0) {
      return res.status(400).json({ error: 'Preço inválido' })
    }

    let duracaoReal = null
    if (duracao !== undefined && duracao !== null && duracao !== '') {
      duracaoReal = Number(duracao)

      if (isNaN(duracaoReal) || duracaoReal <= 0) {
        return res.status(400).json({
          error: 'Duração inválida',
        })
      }
    }

    const result = await pool.query(
      `UPDATE itens
         SET nome        = $1,
             duracao     = $2,
             tipo        = $3,
             categoria   = $4,
             precovenda  = $5
       WHERE controle = $6
         AND aplicacao = 'SERVICO'
       RETURNING controle`,
      [
        nome.trim().toUpperCase(),
        duracaoReal,
        tipo || null,
        categoria || null,
        precoVendaReal,
        controle,
      ],
    )

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: 'Serviço não encontrado',
      })
    }

    res.json({
      message: 'Serviço atualizado com sucesso',
      controle: result.rows[0].controle,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// Atualizar item
app.put('/itens/:controle', async (req, res) => {
  const { controle } = req.params
  const {
    codbarras,
    nome,
    descricao,
    grupo,
    marca,
    quantidade,
    precocusto,
    perlucro,
    precovenda,
    revenda,
  } = req.body
  try {
    await pool.query(
      `UPDATE itens
       SET codbarras=$1, nome=$2, descricao=$3, grupo=$4, marca=$5,
           quantidade=$6, precocusto=$7, perlucro=$8, precovenda=$9, revenda=$10
       WHERE controle=$11`,
      [
        codbarras,
        nome,
        descricao,
        grupo,
        marca,
        quantidade,
        precocusto,
        perlucro,
        precovenda,
        revenda,
        controle,
      ],
    )
    res.sendStatus(200)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Deletar item
app.delete('/itens/:controle', async (req, res) => {
  const { controle } = req.params
  try {
    await pool.query('DELETE FROM itens WHERE controle=$1', [controle])
    res.sendStatus(200)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Buscar item por código
app.get('/itens/buscar-codigo/:codigo', async (req, res) => {
  const { codigo } = req.params
  try {
    const { rows } = await pool.query('SELECT * FROM itens WHERE codbarras=$1', [codigo])
    res.json(rows[0] || null)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Buscar itens por texto (nome ou código)
app.get('/itens/busca/buscar', async (req, res) => {
  const texto = req.query.texto?.trim() || ''

  if (texto === '') return res.json([])

  const like = `%${texto}%`

  try {
    const query = `
      SELECT
        controle,
        nome,
        codbarras,
        precovenda::numeric AS precovenda,
        quantidade::numeric AS quantidade
      FROM itens
      WHERE nome ILIKE $1
         OR CAST(codbarras AS TEXT) ILIKE $1
         OR CAST(controle AS TEXT) ILIKE $1
      ORDER BY nome ASC
      LIMIT 50
    `

    const { rows } = await pool.query(query, [like])

    // Converte para número antes de enviar
    const resposta = rows.map((r) => ({
      ...r,
      precovenda: Number(r.precovenda),
      quantidade: Number(r.quantidade),
    }))

    res.json(resposta)
  } catch (err) {
    console.error('🔴 ERRO NA ROTA /itens/busca/buscar:', err)
    res.status(500).json({ error: err.message })
  }
})

// ==========================
// ROTAS ORÇAMENTOS
// ==========================

app.post('/orcamentos', async (req, res) => {
  const {
    clienteId,
    itens,
    desconto,
    acrescimo,
    valortotalitens,
    valortotal,
    validade,
    observacoes,
    condicao,
    status,
  } = req.body

  console.log('🔍 Itens recebidos Orçamento Novo:', itens)
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const { rows: lastRow } = await client.query(
      `SELECT numero FROM orcamentos ORDER BY id DESC LIMIT 1`,
    )
    let novoNumero = 'ORC0001'
    if (lastRow[0]?.numero) {
      const numAtual = parseInt(lastRow[0].numero.replace('ORC', ''))
      novoNumero = 'ORC' + String(numAtual + 1).padStart(4, '0')
    }

    const orcamentoResult = await client.query(
      `INSERT INTO orcamentos
       (numero, clienteId, validade, observacoes, condicao, desconto, acrescimo, valorTotalItens, valorTotal, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
      [
        novoNumero,
        clienteId,
        validade || null,
        observacoes || null,
        condicao || null,
        desconto || 0,
        acrescimo || 0,
        valortotalitens || 0,
        valortotal || 0,
        status || null,
      ],
    )
    const orcamentoId = orcamentoResult.rows[0].id

    for (const item of itens) {
      const produtoId = Number(item.produtoid || item.controle) || null
      const unit = Number(item.valorunit || 0)
      const qt = Number(item.quantidade || 0)
      const total = qt * unit

      await client.query(
        `INSERT INTO itensOrcamento
     (orcamentoid, produtoid, descricao, quantidade, valorunit, total, tipoitem)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          orcamentoId, // $1
          produtoId, // $2  (código/controle do produto)
          item.nome || item.descricao || '', // $3
          qt, // $4
          unit, // $5
          total, // $6
          item.tipoitem || 'PRODUTO', // $7
        ],
      )
    }

    await client.query('COMMIT')
    res.json({
      sucesso: true,
      mensagem: 'Orçamento criado com sucesso',
      orcamentoId,
      numero: novoNumero,
    })
  } catch (err) {
    await client.query('ROLLBACK')
    res.status(500).json({ error: err.message })
  } finally {
    client.release()
  }
})

// ==========================
// ITENS DO ORÇAMENTO - PostgreSQL
// ==========================

// Listar itens de um orçamento
app.get('/orcamentos/:id/itens', async (req, res) => {
  const { id } = req.params
  try {
    const { rows } = await pool.query(
      'SELECT * FROM itensOrcamento WHERE orcamentoId = $1 ORDER BY id ASC',
      [id],
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/orcamentos', async (req, res) => {
  try {
    const sql = `
      SELECT
        o.*,
        c.nome AS clientenome
      FROM orcamentos o
      LEFT JOIN clientes c ON c.id = o.clienteid
      ORDER BY o.id DESC
    `

    const { rows } = await pool.query(sql)
    res.json(rows)
  } catch (err) {
    console.error('ERRO NA ROTA /orcamentos:', err)
    res.status(500).json({
      error: 'Erro ao buscar orçamentos',
      details: err.message,
    })
  }
})

app.get('/orcamentos/:id', async (req, res) => {
  const { id } = req.params

  try {
    // Buscar o orçamento
    const orcamentoQuery = `
      SELECT *
      FROM orcamentos
      WHERE id = $1
    `
    const { rows: orcamentoRows } = await pool.query(orcamentoQuery, [id])

    if (orcamentoRows.length === 0) {
      return res.status(404).json({ error: 'Orçamento não encontrado' })
    }

    const orcamento = orcamentoRows[0]

    // Buscar os itens
    const itensQuery = `
      SELECT *
      FROM itensOrcamento
      WHERE orcamentoId = $1
    `
    const { rows: itens } = await pool.query(itensQuery, [id])

    // Retorna orçamento + itens igual ao SQLite
    res.json({
      ...orcamento,
      itens,
    })
  } catch (err) {
    console.error('Erro ao buscar orçamento:', err)
    res.status(500).json({ error: err.message })
  }
})

app.get('/orcamentos-detalhe/:id', async (req, res) => {
  const { id } = req.params

  try {
    // Buscar dados do orçamento + cliente
    const sqlOrcamento = `
      SELECT
        o.*,
        c.nome AS clienteNome,
        c.cpf AS clienteCPF,
        c.endereco AS clienteEndereco,
        c.telefone AS clienteTelefone,
        c.celular AS clienteCelular,
        c.email AS clienteEmail
      FROM orcamentos o
      LEFT JOIN clientes c ON c.id = o.clienteId
      WHERE o.id = $1
    `

    const orcamentoResult = await pool.query(sqlOrcamento, [id])

    if (orcamentoResult.rows.length === 0) {
      return res.status(404).json({ error: 'Orçamento não encontrado' })
    }

    const orcamento = orcamentoResult.rows[0]

    // Buscar itens
    const itensResult = await pool.query(`SELECT * FROM itensorcamento WHERE orcamentoid = $1`, [
      id,
    ])

    res.json({
      ...orcamento,
      itens: itensResult.rows,
    })
  } catch (err) {
    console.error('ERRO GET /orcamentos-detalhe:', err)
    res.status(500).json({ error: err.message })
  }
})

// Backend Postgres
// Rota para buscar orçamentos por período
app.get('/orcamentos/fecha/periodo', async (req, res) => {
  const { inicio, fim } = req.query

  // Validação básica
  if (!inicio || !fim) {
    return res.status(400).json({
      error: 'Informe os parâmetros ?inicio=YYYY-MM-DD&fim=YYYY-MM-DD',
    })
  }

  // Verifica se as datas estão no formato correto (YYYY-MM-DD)
  const regexData = /^\d{4}-\d{2}-\d{2}$/
  if (!regexData.test(inicio) || !regexData.test(fim)) {
    return res.status(400).json({
      error: 'Formato de data inválido. Use YYYY-MM-DD',
    })
  }

  try {
    const query = `
      SELECT
        o.id,
        o.numero,
        o.clienteid,
        o.datacriacao,
        o.validade,
        o.valortotal,
        o.status,
        c.nome AS clientenome
      FROM orcamentos o
      LEFT JOIN clientes c ON c.id = o.clienteid
      WHERE o.datacriacao::date BETWEEN $1::date AND $2::date
      ORDER BY o.datacriacao DESC
    `

    const { rows } = await pool.query(query, [inicio, fim])

    res.json(rows)
  } catch (err) {
    console.error('Erro na rota /orcamentos/periodo:', err)
    res.status(500).json({ error: 'Erro interno do servidor', details: err.message })
  }
})

app.get('/orcamentos/status/:status', async (req, res) => {
  const { status } = req.params

  const sql = `
    SELECT
      o.*,
      c.nome AS clienteNome
    FROM orcamentos o
    LEFT JOIN clientes c ON c.id = o.clienteId
    WHERE o.status = $1
    ORDER BY c.nome ASC
  `

  try {
    const result = await pool.query(sql, [status])
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({
      error: 'Erro ao buscar orçamentos por status',
      details: err.message,
    })
  }
})

// Atualizar item de orçamento
app.put('/itensOrcamento/:itemId', async (req, res) => {
  const { itemId } = req.params
  const { descricao, quantidade, valorunit, tipoitem } = req.body
  const total = quantidade * valorunit

  try {
    const result = await pool.query(
      `UPDATE itensOrcamento
       SET descricao=$1, quantidade=$2, valorunit=$3, total=$4, tipoItem=$5
       WHERE id=$6`,
      [descricao, quantidade, valorunit, total, tipoitem, itemId],
    )
    res.json({ updated: result.rowCount })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/orcamentos/:id', async (req, res) => {
  const client = await pool.connect()
  const orcamentoId = req.params.id

  const {
    clienteId,
    itens = [],
    desconto = 0,
    acrescimo = 0,
    validade,
    observacoes,
    condicao,
    status = 'ABERTO',
  } = req.body

  console.log('🔍 Itens recebidos Orçamento Edição::', itens)

  try {
    // 1️⃣ Recalcular totais
    let somaItens = 0
    itens.forEach((item) => {
      const unit = Number(item.precounit || item.valorunit || 0)
      const qt = Number(item.quantidade || 0)
      somaItens += qt * unit
    })

    const valorTotalFinal = somaItens - Number(desconto) + Number(acrescimo)

    // 2️⃣ Iniciar transação
    await client.query('BEGIN')

    // 3️⃣ Atualizar orçamento
    const updateOrcamentoQuery = `
      UPDATE orcamentos
      SET clienteId = $1,
          validade = $2,
          observacoes = $3,
          condicao = $4,
          desconto = $5,
          acrescimo = $6,
          valortotalitens = $7,
          valortotal = $8,
          status = $9
      WHERE id = $10
    `

    await client.query(updateOrcamentoQuery, [
      clienteId,
      validade || null,
      observacoes || null,
      condicao || null,
      Number(desconto),
      Number(acrescimo),
      somaItens,
      valorTotalFinal,
      status,
      orcamentoId,
    ])

    // 4️⃣ Remover itens antigos
    await client.query(`DELETE FROM itensorcamento WHERE orcamentoid = $1`, [orcamentoId])

    // 5️⃣ Inserir novos itens
    const insertItemQuery = `
      INSERT INTO itensorcamento
      (orcamentoid, produtoid, descricao, quantidade, valorunit, total, tipoitem)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `

    for (const item of itens) {
      const produtoId = Number(item.produtoid) || null
      const unit = Number(item.precounit || item.valorunit || 0)
      const qt = Number(item.quantidade || 0)
      const total = qt * unit

      console.log('➡️ Salvando item: produtoid =', produtoId)

      await client.query(insertItemQuery, [
        orcamentoId,
        produtoId, // CORRETO AGORA
        item.nome || item.descricao || '',
        qt,
        unit,
        total,
        item.tipoitem || 'PRODUTO',
      ])
    }

    // 6️⃣ Commit da transação
    await client.query('COMMIT')

    res.json({
      sucesso: true,
      mensagem: 'Orçamento atualizado com sucesso',
      orcamentoId,
      somaItens,
      valorTotalFinal,
    })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('❌ ERRO PUT /orcamentos/:id', err)
    res.status(500).json({ error: err.message })
  } finally {
    client.release()
  }
})

// Deletar item de orçamento
app.delete('/itensOrcamento/:itemId', async (req, res) => {
  const { itemId } = req.params
  try {
    const result = await pool.query('DELETE FROM itensOrcamento WHERE id=$1', [itemId])
    res.json({ deleted: result.rowCount })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/orcamentos/:id', async (req, res) => {
  const client = await pool.connect()
  const { id } = req.params

  try {
    await client.query('BEGIN')

    // 1️⃣ Verifica se o orçamento existe
    const { rowCount } = await client.query('SELECT id FROM orcamentos WHERE id = $1', [id])
    if (rowCount === 0) {
      await client.query('ROLLBACK')
      return res.status(404).json({ success: false, error: 'Orçamento não encontrado' })
    }

    // 2️⃣ Deleta itens associados (itensorcamento)
    await client.query('DELETE FROM itensorcamento WHERE orcamentoid = $1', [id])

    // 3️⃣ Deleta o orçamento
    const result = await client.query('DELETE FROM orcamentos WHERE id = $1', [id])

    await client.query('COMMIT')

    res.json({
      success: true,
      deleted: result.rowCount,
    })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('ERRO DELETE /orcamentos/:id', err)
    res.status(500).json({ success: false, error: err.message })
  } finally {
    client.release()
  }
})

//ROTAS DA ORDEM DE SERVIÇOS

app.get('/ordens', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT
      os.id,
      os.numeroos,
      os.clienteid,
      os.objetoveiculoid,
      c.nome AS cliente,
      os.dataabertura,
      os.status,
      os.observacoes,
      os.laudo,
      os.valortotalitem,
      os.desconto,
      os.acrescimo,
      os.adiantamento,
      os.valortotal
      FROM ordemservico os
      JOIN clientes c ON c.id = os.clienteid
      ORDER BY os.id DESC
  `)

  res.json(rows)
})

app.post('/ordens', async (req, res) => {
  const client = await pool.connect()

  try {
    const {
      clienteid,
      objetoveiculoid,
      laudo,
      dataabertura,
      status,
      descricao,
      observacoes,
      garantia,
      desconto = 0,
      acrescimo = 0,
      formapagamento,
      adiantamento = 0,
      itens,
    } = req.body

    // 🔎 Validações básicas
    if (!clienteid) {
      return res.status(400).json({ error: 'clienteid é obrigatório' })
    }

    if (!objetoveiculoid) {
      return res.status(400).json({ error: 'objetoveiculoid é obrigatório' })
    }

    if (!Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ error: 'A OS precisa ter ao menos 1 item' })
    }

    await client.query('BEGIN')

    // 🔢 Gerar número da OS
    const { rows } = await client.query(
      `SELECT numeroos FROM ordemservico ORDER BY id DESC LIMIT 1`,
    )

    let numeroos = 'OS0001'
    if (rows.length) {
      const atual = parseInt(rows[0].numeroos.replace('OS', ''))
      numeroos = 'OS' + String(atual + 1).padStart(4, '0')
    }

    // ================================
    // 🔐 REGRA FINANCEIRA (BACKEND)
    // ================================
    const VALOR_MINIMO_FATURA = 0.01

    // 🔢 Subtotal calculado pelos itens
    const subtotal = itens.reduce((acc, item) => {
      return acc + Number(item.quantidade) * Number(item.valorunitario)
    }, 0)

    let descontoNum = Math.max(0, Number(desconto) || 0)
    let acrescimoNum = Math.max(0, Number(acrescimo) || 0)
    let adiantamentoNum = Math.max(0, Number(adiantamento) || 0)

    // 🔒 Limite combinado (nunca zerar)
    const limite = subtotal - VALOR_MINIMO_FATURA

    if (limite > 0) {
      if (adiantamentoNum > limite) {
        adiantamentoNum = limite
      }

      if (descontoNum + adiantamentoNum > limite) {
        descontoNum = limite - adiantamentoNum
      }
    }

    // 🔢 Total final blindado
    let totalCalculado = subtotal - descontoNum - adiantamentoNum + acrescimoNum

    if (totalCalculado < VALOR_MINIMO_FATURA) {
      totalCalculado = VALOR_MINIMO_FATURA
    }

    // 🔢 Separação por tipo (opcional / compatível)
    const valortotalitem = itens
      .filter((i) => i.tipoitem === 'PRODUTO')
      .reduce((s, i) => s + Number(i.quantidade || 0) * Number(i.valorunitario || 0), 0)

    const valortotalserv = itens
      .filter((i) => i.tipoitem === 'SERVICO')
      .reduce((s, i) => s + Number(i.quantidade || 0) * Number(i.valorunitario || 0), 0)

    // ================================
    // 🧾 INSERT ORDEM DE SERVIÇO
    // ================================
    const ordemResult = await client.query(
      `
      INSERT INTO ordemservico (
        numeroos,
        clienteid,
        objetoveiculoid,
        laudo,
        dataabertura,
        status,
        descricao,
        observacoes,
        garantia,
        desconto,
        acrescimo,
        valortotalitem,
        valortotalserv,
        valortotal,
        formapagamento,
        adiantamento
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16
      )
      RETURNING id
      `,
      [
        numeroos,
        clienteid,
        objetoveiculoid,
        laudo || null,
        dataabertura,
        status || 'ABERTA',
        descricao || null,
        observacoes || null,
        garantia || null,
        descontoNum,
        acrescimoNum,
        valortotalitem,
        valortotalserv,
        totalCalculado,
        formapagamento || null,
        adiantamentoNum,
      ],
    )

    const ordemservicoid = ordemResult.rows[0].id

    // ================================
    // 🧩 INSERT ITENS
    // ================================
    for (const item of itens) {
      await client.query(
        `
        INSERT INTO itensordemservico (
          ordemservicoid,
          produtoid,
          descricao,
          tipoitem,
          quantidade,
          valorunitario,
          total,
          tecnico
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        `,
        [
          ordemservicoid,
          item.produtoid || null,
          item.descricao || '',
          item.tipoitem || 'PRODUTO',
          Number(item.quantidade),
          Number(item.valorunitario),
          Number(item.total),
          item.tecnico || null,
        ],
      )
    }

    await client.query('COMMIT')

    res.status(201).json({
      sucesso: true,
      mensagem: 'Ordem de serviço criada com sucesso',
      ordemservicoid,
      numeroos,
    })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('❌ ERRO AO SALVAR OS:', err)

    res.status(500).json({ error: err.message })
  } finally {
    client.release()
  }
})

app.put('/ordens/:id', async (req, res) => {
  const { id } = req.params
  const client = await pool.connect()

  try {
    const {
      clienteid,
      objetoveiculoid,
      status,
      observacoes,
      laudo,
      desconto = 0,
      acrescimo = 0,
      adiantamento = 0,
      itens,
    } = req.body

    // 🔒 Validações mínimas
    if (!clienteid) {
      return res.status(400).json({ error: 'clienteid é obrigatório' })
    }

    if (!Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ error: 'A OS precisa ter itens' })
    }

    await client.query('BEGIN')

    // 🧾 Atualiza cabeçalho (AGORA COM STATUS)
    await client.query(
      `
      UPDATE ordemservico SET
        clienteid = $1,
        objetoveiculoid = $2,
        status = $3,
        observacoes = $4,
        laudo = $5,
        desconto = $6,
        acrescimo = $7,
        adiantamento = $8
      WHERE id = $9
      `,
      [
        clienteid,
        objetoveiculoid || null,
        status || 'ABERTA',
        observacoes || null,
        laudo || null,
        Number(desconto),
        Number(acrescimo),
        Number(adiantamento),
        id,
      ],
    )

    // 🧹 Remove itens antigos
    await client.query('DELETE FROM itensordemservico WHERE ordemservicoid = $1', [id])

    // 🧩 Insere itens novamente
    for (const item of itens) {
      await client.query(
        `
        INSERT INTO itensordemservico (
          ordemservicoid,
          produtoid,
          descricao,
          tipoitem,
          quantidade,
          valorunitario,
          total
        ) VALUES ($1,$2,$3,$4,$5,$6,$7)
        `,
        [
          id,
          item.produtoid || null,
          item.descricao || '',
          item.tipoitem || 'PRODUTO',
          Number(item.quantidade),
          Number(item.valorunitario),
          Number(item.total),
        ],
      )
    }

    await client.query('COMMIT')

    res.json({ success: true })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('❌ ERRO PUT OS:', err)
    res.status(500).json({ error: err.message })
  } finally {
    client.release()
  }
})

app.get('/ordens/:id/itens', async (req, res) => {
  const { id } = req.params

  try {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM itensordemservico
      WHERE ordemservicoid = $1
      ORDER BY id ASC
      `,
      [id],
    )

    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/clientes/:id/objetos', async (req, res) => {
  const { id } = req.params

  try {
    const { rows } = await pool.query(
      `
      SELECT
        id,
        tipo,
        marca,
        modelo,
        ano,
        placaserie,
        numeroserie,
        status
      FROM objetosveiculos
      WHERE clienteid = $1
        AND ativo = 'SIM'
      ORDER BY tipo, marca, modelo
      `,
      [id],
    )

    // 🔹 SEM OBJETOS → array vazio
    return res.json(rows || [])
  } catch (err) {
    console.error('Erro ao buscar objetos do cliente:', err)
    return res.status(500).json({ error: err.message })
  }
})

// ==========================================
//  INICIAR SERVIDOR
// ==========================================
const PORT = 3000
app.listen(PORT, async () => {
  console.log(`🚀 Servidor iniciado em http://localhost:${PORT}`)
  await carregarBanco() // roda bancodav.sql se existir
})

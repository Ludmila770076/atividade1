const express = require('express');
const mysql = require('mysql2/promise');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const app = express();
app.disable("x-powered-by");

app.use(express.json());
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'crudapi',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Configuração do Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de CRUD de usuários',
      version: '1.0.0',
      description: 'API para criar, ler, atualizar e deletar usuários'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local'
      }
    ]
  },
  apis: ['index.js']
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


//usuario
app.get('/users', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM usuario');
  res.json(rows);
});

app.post('/users', async (req, res) => {
  const { NOME, IDADE } = req.body;
  const [result] = await pool.query('INSERT INTO usuario (NOME, IDADE) VALUES (?, ?)', [NOME, IDADE]);
  res.json({ id: result.insertId, NOME:NOME, IDADE:IDADE});
});

app.put('/users/:id', async (req, res) => {
  const { NOME, IDADE } = req.body;
  const { id } = req.params;
  await pool.query('UPDATE usuario SET NOME = ?, IDADE = ? WHERE id = ?', [NOME, IDADE, id]);
  res.status(200).json({ id: id, NOME: NOME, IDADE: IDADE });
});

app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM usuario WHERE id = ?', [id]);
  res.status(200).json({ id: Number(id) });
 
});


//consulta por nome de usuario
app.get('/users/:nome', async (req, res) => {
  try{
    const { nome } = req.params;
    const [rows] =  await pool.query('SELECT id, nome, idade FROM usuario WHERE nome = ?', [nome]);
    res.status(200).json(rows);
  }catch (error){
    console.error('erro na busca de produto por nome', error);
  }
  res.status(500).send('Erro ao buscar protudo ');
});


//consulta por id de Usuario
app.get('/users1/:id', async (req, res) => {
  const { id } = req.params;
  const [rows] =  await pool.query('SELECT * FROM usuario WHERE id = ?', [id]);
  res.json(rows);

});


app.listen(3000);

const server = app.listen(3000, () => {
  console.log('Servidor port 300');
});

//Mater o servidor rodando mesmo se ocorrer um erro
process.on('uncaughtException', (err) => {
  console.error ('Erro não tratado', err);
});

process.on('unhandledRejection', (err) => {
  console.error ('Rejeição não tratado', err);
});
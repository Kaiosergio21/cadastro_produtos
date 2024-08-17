const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 6005;
const path = require('path');

// Middleware para servir arquivos estáticos (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear JSON
app.use(express.json());

// Conexão com o banco de dados MySQL
const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'lojas_americanas',
});

database.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("Conectado ao banco de dados MySQL");
});

// Rota para servir o arquivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para criar um novo produto
app.post('/create', (req, res) => {
    const { nome, preco } = req.body;

    if (nome && preco) {
        const sql = 'INSERT INTO produtos (nome, preco) VALUES (?, ?)';
        database.query(sql, [nome, preco], (err, result) => {
            if (err) {
                console.error('Erro ao inserir dados:', err);
                res.status(500).send('Erro ao inserir dados');
            } else {
                res.status(200).send('Produto criado com sucesso');
                
            }
        });
    } else {
        res.status(400).send('Dados incompletos');
    }
});
// Rota para atualizar produto
app.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, preco } = req.body;

    try {
        const produto = await Produto.findByPk(id); // Assumindo que `Produto` é seu modelo Sequelize
        if (produto) {
            produto.nome = nome;
            produto.preco = preco;
            await produto.save();
            res.status(200).send('Produto atualizado com sucesso!');
        } else {
            res.status(404).send('Produto não encontrado.');
        }
    } catch (error) {
        res.status(500).send('Erro ao atualizar produto: ' + error.message);
    }
});

// Rota para deletar produto
app.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await Produto.destroy({ where: { id } });
        if (resultado) {
            res.status(200).send('Produto deletado com sucesso!');
        } else {
            res.status(404).send('Produto não encontrado.');
        }
    } catch (error) {
        res.status(500).send('Erro ao deletar produto: ' + error.message);
    }
});


app.get('/produtos', (req, res) => {
    const query = 'SELECT * FROM produtos';
    database.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});



// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta http://localhost:${port}`);
});

const express = require('express');
const sql = require('mssql');
const path = require('path');
const app = express();

app.use(express.json());

// Servir archivos estáticos con ruta absoluta segura
app.use(express.static(path.join(__dirname, 'public')));

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, 
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

// Endpoints de API
app.get('/api/tickets', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query("SELECT * FROM Tickets ORDER BY id DESC");
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/api/tickets', async (req, res) => {
    try {
        const { usuario, asunto, prioridad } = req.body;
        let pool = await sql.connect(config);
        await pool.request()
            .input('u', sql.VarChar, usuario)
            .input('a', sql.VarChar, asunto)
            .input('p', sql.VarChar, prioridad)
            .query("INSERT INTO Tickets (usuario, asunto, prioridad, estado) VALUES (@u, @a, @p, 'Abierto')");
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Captura cualquier otra ruta y sirve el index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
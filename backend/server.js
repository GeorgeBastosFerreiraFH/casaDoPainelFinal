const express = require('express');
const pool = require('./db');
const app = express();
const bcrypt = require('bcrypt');
const cors = require('cors');
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Rota para buscar todos os usuários (Acesso: Administrador)
app.get('/usuarios', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});

// Rota para buscar usuários de uma célula (Acesso: Líder de Célula)
app.get('/usuarios/celula/:idCelula', async (req, res) => {
    const { idCelula } = req.params;
    try {
        const [rows] = await pool.query(`
            SELECT u.* FROM usuarios u
            JOIN usuarios_celulas uc ON u.id = uc.idUsuario
            WHERE uc.idCelula = ?`, [idCelula]);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao buscar usuários da célula:', error);
        res.status(500).json({ error: 'Erro ao buscar usuários da célula' });
    }
});

// Rota para buscar os dados de um usuário específico (Acesso: Usuário Comum)
app.get('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(`
            SELECT u.*, l.nomeCompleto AS nomeLider FROM usuarios u
            LEFT JOIN usuarios l ON u.idLiderCelula = l.id
            WHERE u.id = ?`, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
});

// Rota para cadastrar um novo usuário (Acesso: Administrador)
app.post('/usuarios', async (req, res) => {
    const {
        nomeCompleto,
        dataNascimento,
        email,
        telefone,
        senhaCadastro,
        tipoUsuario,
        concluiuBatismo,
        participouCafe,
        participaMinisterio,
        nomeMinisterio,
        nomeCelula,
        participaCelula,
        cursoMeuNovoCaminho,
        cursoVidaDevocional,
        cursoFamiliaCrista,
        cursoVidaProsperidade,
        cursoPrincipiosAutoridade,
        cursoVidaEspirito,
        cursoCaraterCristo,
        cursoIdentidadesRestauradas,
    } = req.body;

    // Logando os dados recebidos
    console.log('Dados recebidos:', req.body);

    try {
        // Cria o hash da senha
        const hashedPassword = await bcrypt.hash(senhaCadastro, 10);

        const [result] = await pool.query(`
            INSERT INTO usuarios (
                nomeCompleto, 
                dataNascimento, 
                email, 
                telefone, 
                concluiuBatismo, 
                participouCafe, 
                participaMinisterio, 
                nomeMinisterio, 
                participaCelula, 
                nomeCelula, 
                cursoMeuNovoCaminho, 
                cursoVidaDevocional, 
                cursoFamiliaCrista, 
                cursoVidaProsperidade, 
                cursoPrincipiosAutoridade, 
                cursoVidaEspirito, 
                cursoCaraterCristo, 
                cursoIdentidadesRestauradas, 
                senhaCadastro,
                tipoUsuario
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`, [
            nomeCompleto, 
            dataNascimento, 
            email, 
            telefone, 
            concluiuBatismo, 
            participouCafe, 
            participaMinisterio, 
            nomeMinisterio, 
            participaCelula, 
            nomeCelula, 
            cursoMeuNovoCaminho, 
            cursoVidaDevocional, 
            cursoFamiliaCrista, 
            cursoVidaProsperidade, 
            cursoPrincipiosAutoridade, 
            cursoVidaEspirito, 
            cursoCaraterCristo, 
            cursoIdentidadesRestauradas, 
            hashedPassword, // Armazena o hash da senha
            tipoUsuario
        ]);

        // Logando o resultado da inserção
        console.log('Resultado da inserção:', result);

        res.status(201).json({ message: 'Usuário cadastrado com sucesso', id: result.insertId });
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error.message);
        res.status(500).json({ error: 'Erro ao cadastrar usuário' });
    }
});

// Rota para atualizar um usuário (Acesso: Administrador e Líder de Célula)
app.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { nomeCompleto, dataNascimento, email, telefone, tipoUsuario } = req.body;
    try {
        const [result] = await pool.query(`
            UPDATE usuarios SET nomeCompleto = ?, dataNascimento = ?, email = ?, telefone = ?, tipoUsuario = ?
            WHERE id = ?`, [nomeCompleto, dataNascimento, email, telefone, tipoUsuario, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.status(200).json({ message: 'Usuário atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
});

// Rota para autenticação de login
app.post('/login', async (req, res) => {
    const { email, senhaCadastro } = req.body;

    // Logando os dados recebidos
    console.log('Dados de login recebidos:', req.body);

    try {
        // Buscando o usuário pelo e-mail
        const [usuarios] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);

        if (usuarios.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const usuario = usuarios[0];

        // Aqui você deve verificar a senha (considerando que você deve estar armazenando a senha de forma segura)
        // Exemplo: se você estiver usando bcrypt
        const senhaValida = usuario.senhaCadastro === senhaCadastro; // Verificação direta


        if (!senhaValida) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Se a autenticação for bem-sucedida, você pode retornar o tipo de usuário
        res.status(200).json({ tipoUsuario: usuario.tipoUsuario });
    } catch (error) {
        console.error('Erro ao autenticar usuário:', error.message);
        res.status(500).json({ error: 'Erro ao autenticar usuário' });
    }
});

// Rota para deletar um usuário (Acesso: Administrador)
app.delete('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query(`
            DELETE FROM usuarios WHERE id = ?`, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

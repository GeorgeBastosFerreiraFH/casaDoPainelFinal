const express = require('express');
const { connectToDatabase } = require('../backend/db');
const { Usuario } = require('../modelo/usuario');
const bcrypt = require('bcrypt');
const cors = require('cors');
const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Conecta ao banco de dados MongoDB Atlas
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}).catch((error) => {
  console.error('Erro ao iniciar o servidor:', error);
  process.exit(1);
});

// Rota para buscar todos os usuários (Acesso: Administrador)
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find({}, { __v: 0 }); // Busca todos os usuários e exclui o campo __v
    res.status(200).json(usuarios);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// Rota para obter usuários da célula do líder
app.get('/celulas/:idCelula/usuarios', async (req, res) => {
  const { idCelula } = req.params;
  console.log('Buscando usuários para a célula:', idCelula);
  try {
    const usuarios = await Usuario.find({ idCelula, tipoUsuario: 'UsuarioComum' }, { __v: 0 });

    if (usuarios.length === 0) {
      console.log('Nenhum usuário encontrado para esta célula');
      return res.status(404).json({ error: 'Nenhum usuário encontrado para esta célula' });
    }
    res.status(200).json(usuarios);
  } catch (error) {
    console.error('Erro ao buscar usuários da célula:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários da célula' });
  }
});

// Rota para buscar os dados de um usuário específico
app.get('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findById(id, { __v: 0 });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    console.log('Usuário encontrado:', usuario);
    res.status(200).json(usuario);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário', detalhes: error.message });
  }
});

// Rota para cadastrar um novo usuário
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
    idCelula,
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

  console.log('Dados recebidos:', req.body);

  try {
    const hashedPassword = await bcrypt.hash(senhaCadastro, 10);

    const novoUsuario = new Usuario({
      nomeCompleto,
      dataNascimento,
      email,
      telefone,
      senhaCadastro: hashedPassword,
      tipoUsuario,
      concluiuBatismo,
      participouCafe,
      participaMinisterio,
      nomeMinisterio,
      idCelula,
      participaCelula,
      cursoMeuNovoCaminho,
      cursoVidaDevocional,
      cursoFamiliaCrista,
      cursoVidaProsperidade,
      cursoPrincipiosAutoridade,
      cursoVidaEspirito,
      cursoCaraterCristo,
      cursoIdentidadesRestauradas,
    });

    const usuario = await novoUsuario.save();

    console.log('Usuário cadastrado:', usuario);
    res.status(201).json({ message: 'Usuário cadastrado com sucesso', id: usuario._id });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error.message);
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
});

// Rota para atualizar um usuário
app.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
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

  try {
    // Verifica se a senha foi fornecida e, se sim, cria um hash para ela
    let hashedPassword = null;
    if (senhaCadastro) {
      hashedPassword = await bcrypt.hash(senhaCadastro, 10);
    }

    const usuario = await Usuario.findByIdAndUpdate(
      id,
      {
        nomeCompleto,
        dataNascimento,
        email,
        telefone,
        senhaCadastro: hashedPassword,
        tipoUsuario,
        concluiuBatismo,
        participouCafe,
        participaMinisterio,
        nomeMinisterio,
        participaCelula,
        cursoMeuNovoCaminho,
        cursoVidaDevocional,
        cursoFamiliaCrista,
        cursoVidaProsperidade,
        cursoPrincipiosAutoridade,
        cursoVidaEspirito,
        cursoCaraterCristo,
        cursoIdentidadesRestauradas,
      },
      { new: true, runValidators: true }
    );

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.status(200).json({ message: 'Usuário atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar usuário', details: error.message });
  }
});

// Rota para autenticação de login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  console.log('Tentativa de login para:', email);

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      console.log('Usuário não encontrado');
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const match = await bcrypt.compare(senha, usuario.senhaCadastro);

    if (!match) {
      console.log('Senha incorreta');
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    let idCelula = usuario.idCelula || null;

    console.log('Login bem-sucedido:', {
      id: usuario._id,
      nome: usuario.nomeCompleto,
      tipoUsuario: usuario.tipoUsuario,
      idCelula: idCelula,
    });

    res.status(200).json({
      message: 'Login bem-sucedido',
      usuario: {
        id: usuario._id,
        nome: usuario.nomeCompleto,
        tipoUsuario: usuario.tipoUsuario,
        idCelula: idCelula,
      },
    });
  } catch (error) {
    console.error('Erro detalhado ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao fazer login', detalhes: error.message });
  }
});

// Rota para deletar um usuário (Acesso: Administrador)
app.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  console.log('Tentando deletar usuário com ID:', id);
  try {
    const resultado = await Usuario.deleteOne({ _id: id });

    if (resultado.deletedCount === 0) {
      console.log('Usuário não encontrado para exclusão');
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.status(200).json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro detalhado ao deletar usuário:', error);
    res.status(500).json({ error: 'Erro ao deletar usuário', detalhes: error.message });
  }
});

// Rota para tornar um usuário líder de célula
app.put('/usuarios/:id/tornar-lider', async (req, res) => {
  const { id } = req.params;
  console.log(`Tentando tornar usuário ${id} líder de célula`);

  try {
    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (usuario.tipoUsuario === 'LiderCelula') {
      return res.status(400).json({ error: 'Usuário já é líder de célula' });
    }

    if (!usuario.idCelula) {
      return res.status(400).json({ error: 'O usuário não está associado a nenhuma célula' });
    }

    usuario.tipoUsuario = 'LiderCelula';
    await usuario.save();

    // Atualiza todos os usuários da mesma célula para terem este líder
    await Usuario.updateMany({ idCelula: usuario.idCelula, _id: { $ne: usuario._id } }, { idLiderCelula: usuario._id });

    console.log(`Usuário ${id} promovido a líder da célula ${usuario.idCelula} com sucesso`);
    res.status(200).json({ message: 'Usuário promovido a líder de célula com sucesso' });
  } catch (error) {
    console.error('Erro ao promover usuário a líder:', error);
    res.status(500).json({ error: 'Erro ao promover usuário a líder', detalhes: error.message });
  }
});

// Rota para rebaixar um usuário para usuário comum
app.put('/usuarios/:id/rebaixar-lider', async (req, res) => {
  const { id } = req.params;
  console.log(`Tentando rebaixar líder ${id} para usuário comum`);

  try {
    const usuario = await Usuario.findOne({ _id: id, tipoUsuario: 'LiderCelula' });
    if (!usuario) {
      return res.status(404).json({ error: 'Líder não encontrado' });
    }

    usuario.tipoUsuario = 'UsuarioComum';
    await usuario.save();

    console.log(`Usuário ${id} rebaixado para usuário comum com sucesso`);
    res.status(200).json({ message: 'Usuário rebaixado para usuário comum com sucesso' });
  } catch (error) {
    console.error('Erro ao rebaixar usuário:', error);
    res.status(500).json({ error: 'Erro ao rebaixar usuário', detalhes: error.message });
  }
});


module.exports = app;
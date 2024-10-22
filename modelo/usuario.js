const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nomeCompleto: { type: String, required: true },
    dataNascimento: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    telefone: { type: String, required: true },
    concluiuBatismo: { type: Boolean, required: true },
    participouCafe: { type: Boolean, required: true },
    participaMinisterio: { type: Boolean, required: true },
    nomeMinisterio: { type: String },
    participaCelula: { type: Boolean, required: true },
    idCelula: { type: mongoose.Schema.Types.ObjectId, ref: 'Celula' },
    cursoMeuNovoCaminho: { type: Boolean, required: true },
    cursoVidaDevocional: { type: Boolean, required: true },
    cursoFamiliaCrista: { type: Boolean, required: true },
    cursoVidaProsperidade: { type: Boolean, required: true },
    cursoPrincipiosAutoridade: { type: Boolean, required: true },
    cursoVidaEspirito: { type: Boolean, required: true },
    cursoCaraterCristo: { type: Boolean, required: true },
    cursoIdentidadesRestauradas: { type: Boolean, required: true },
    senhaCadastro: { type: String, required: true },
    tipoUsuario: { type: String, enum: ['Administrador', 'LiderCelula', 'UsuarioComum'], default: 'UsuarioComum' },
    idLiderCelula: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = { Usuario };
CREATE DATABASE casaDoPai;

USE casaDoPai;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nomeCompleto VARCHAR(100),
    dataNascimento DATE,
    email VARCHAR(100),
    telefone VARCHAR(50),
    concluiuBatismo BOOL,
    participouCafe BOOL,
    participaMinisterio BOOL,
    nomeMinisterio VARCHAR(100),
    participaCelula BOOL,
    nomeCelula VARCHAR(100),
    cursoMeuNovoCaminho BOOL,
    cursoVidaDevocional BOOL,
    cursoFamiliaCrista BOOL,
    cursoVidaProsperidade BOOL,
    cursoPrincipiosAutoridade BOOL,
    cursoVidaEspirito BOOL,
    cursoCaraterCristo BOOL,
    cursoIdentidadesRestauradas BOOL,
    senhaCadastro VARCHAR(255),
    tipoUsuario ENUM('Administrador', 'LiderCelula', 'UsuarioComum') DEFAULT 'UsuarioComum',
    idLiderCelula INT, -- FK para vincular ao líder da célula
    FOREIGN KEY (idLiderCelula) REFERENCES usuarios(id) -- Relação com o líder da célula
);

CREATE TABLE celulas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nomeCelula VARCHAR(100) NOT NULL,
    idLiderCelula INT, -- FK para vincular ao líder da célula
    FOREIGN KEY (idLiderCelula) REFERENCES usuarios(id)
);

CREATE TABLE ministerios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nomeMinisterio VARCHAR(100) NOT NULL
);

CREATE TABLE usuarios_celulas (
    idUsuario INT,
    idCelula INT,
    FOREIGN KEY (idUsuario) REFERENCES usuarios(id),
    FOREIGN KEY (idCelula) REFERENCES celulas(id)
);

CREATE TABLE usuarios_ministerios (
    idUsuario INT,
    idMinisterio INT,
    FOREIGN KEY (idUsuario) REFERENCES usuarios(id),
    FOREIGN KEY (idMinisterio) REFERENCES ministerios(id)
);

CREATE TABLE lideres_celulas (
    idLiderCelula INT,
    idCelula INT,
    FOREIGN KEY (idLiderCelula) REFERENCES usuarios(id),
    FOREIGN KEY (idCelula) REFERENCES celulas(id)
);

DROP TABLE usuarios;

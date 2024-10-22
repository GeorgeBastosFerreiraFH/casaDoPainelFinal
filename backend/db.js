const mongoose = require('mongoose');

async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb+srv://gebe:IfkC2SpyBwOarhN8@casadopai3.h80d9.mongodb.net/?retryWrites=true&w=majority&appName=casaDoPai3', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexão ao banco de dados MongoDB bem-sucedida!');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados MongoDB:', error);
    throw error;
  }
}

module.exports = { connectToDatabase };
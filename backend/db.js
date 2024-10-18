const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Acasadopai102030", 
  database: "casaDoPai",
});

// Testando a conexão
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Conexão ao banco de dados bem-sucedida!");
    connection.release();
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
  }
}

testConnection(); // Testa a conexão ao iniciar o servidor

module.exports = pool;

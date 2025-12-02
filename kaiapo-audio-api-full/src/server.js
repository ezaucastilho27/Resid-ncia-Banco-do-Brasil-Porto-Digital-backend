require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando em ${MONGODB_URI}:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Falha ao conectar ao banco de dados:', err);
    process.exit(1);
  });

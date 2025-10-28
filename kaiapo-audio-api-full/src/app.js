const express = require('express');
const cors = require('cors');
const audioRoutes = require('./routes/audioRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads')); // servir arquivos locais

app.use('/api/audios', audioRoutes);

// health check
app.get('/', (req, res) => res.json({ status: 'ok', service: 'kaiapo-audio-api' }));

module.exports = app;

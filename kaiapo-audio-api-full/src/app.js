const express = require('express');
const cors = require('cors');
const audioRoutes = require('./routes/audioRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads')); // servir arquivos locais

app.use('/api', audioRoutes);

// health check
app.get('/', (_req, res) => res.json({ status: 'ok', service: 'kaiapo-audio-api' }));

module.exports = app;

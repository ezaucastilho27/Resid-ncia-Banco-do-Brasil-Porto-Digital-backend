const Audio = require('../models/Audio');
const storageService = require('../services/storageService');

exports.uploadAudio = async (req, res) => {
  try {
    // Multer colocou info do arquivo em req.file
    const { file } = req;
    const { name, email, agreePrivacy, community, service } = req.body;

    if (!file) return res.status(400).json({ error: 'Arquivo de áudio é obrigatório' });
    if (!name || !email || typeof agreePrivacy === 'undefined' || !community || !service) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    // envia para storage (local ou s3)
    const storeResult = await storageService.uploadFile(file);

    const audio = await Audio.create({
      name,
      email,
      agreePrivacy: (agreePrivacy === 'true' || agreePrivacy === true),
      community,
      service,
      filename: storeResult.filename,
      storage: storeResult.storage,
      url: storeResult.url,
      size: file.size,
      mimeType: file.mimetype
    });

    return res.status(201).json({ message: 'Upload realizado', audio });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

exports.listAudios = async (req, res) => {
  try {
    const audios = await Audio.find().sort({ createdAt: -1 });
    res.json(audios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar áudios' });
  }
};

exports.getAudio = async (req, res) => {
  try {
    const { id } = req.params;
    const audio = await Audio.findById(id);
    if (!audio) return res.status(404).json({ error: 'Áudio não encontrado' });
    res.json(audio);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar áudio' });
  }
};

// rota para servir ou redirecionar para o arquivo
exports.streamOrRedirect = async (req, res) => {
  try {
    const { filename } = req.params;
    const info = await storageService.getFileInfo(filename);
    if (!info) return res.status(404).json({ error: 'Arquivo não encontrado' });

    if (info.storage === 's3' && info.url) {
      // redireciona para URL assinada (S3 public/private handling)
      return res.redirect(info.url);
    }

    // local storage: faça streaming
    const stream = storageService.streamLocalFile(info.path);
    res.setHeader('Content-Type', info.mimeType || 'audio/mpeg');
    stream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao obter arquivo' });
  }
};

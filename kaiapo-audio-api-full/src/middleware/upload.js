const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// armazenamento temporário em memória para envio posterior ao storageService
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // aceitar apenas tipos de áudio
  if (file.mimetype && file.mimetype.startsWith('audio')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos de áudio são permitidos'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

module.exports = upload;

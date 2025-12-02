const express = require('express');
const router = express.Router();
const audioController = require('../controllers/audioController');
const serviceController = require('../controllers/serviceController');
const upload = require('../middleware/upload');

// POST upload (field name "audio")
router.post('/', upload.single('audio'), audioController.uploadAudio);

// POST dar like em audio
router.post('/audio/:id/like/:action', audioController.likeAudio);

// POST adicionar servicos
router.post('/servicos', serviceController.addService)

// GET lista
router.get('/', audioController.listAudios);

// stream/redirect por filename
router.get('/url/:filename', audioController.streamOrRedirect);

// GET lista por serviço
router.get('/service/:serviceId', audioController.listAudioByService)

// GET detalhes
router.get('/audio/:id', audioController.getAudio);

module.exports = router;

const express = require('express');
const router = express.Router();
const audioController = require('../controllers/audioController');
const upload = require('../middleware/upload');

// POST upload (field name "audio")
router.post('/', upload.single('audio'), audioController.uploadAudio);

// GET lista
router.get('/', audioController.listAudios);

// stream/redirect por filename
router.get('/url/:filename', audioController.streamOrRedirect);

// GET lista por serviço
router.get('/service/:serviceId', audioController.listAudioByService)

// GET detalhes
router.get('/audio/:id', audioController.getAudio);

module.exports = router;

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
router.post('/services', serviceController.addService)

// DELETE serviço
router.delete('/services/:serviceId', serviceController.deleteService)

// GET lista de serviços
router.get('/services', serviceController.listServices)

// GET lista
router.get('/audios', audioController.listAudios);

// stream/redirect por filename
router.get('/url/:filename', audioController.streamOrRedirect);

// GET lista por serviço
router.get('/audios/:serviceId', audioController.listAudioByService)

// GET detalhes
router.get('/audio/:id', audioController.getAudio);

module.exports = router;

const express = require('express');
const router = express.Router();
const audioController = require('../controllers/audioController');
const upload = require('../middleware/upload');

// POST upload (field name "audio")
router.post('/', upload.single('audio'), audioController.uploadAudio);

// GET lista
router.get('/', audioController.listAudios);

// GET detalhe
router.get('/:id', audioController.getAudio);

// stream/redirect por filename
router.get('/url/:filename', audioController.streamOrRedirect);

module.exports = router;

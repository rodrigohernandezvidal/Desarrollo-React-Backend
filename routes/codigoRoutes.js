const express = require('express');
const { generarCodigo } = require('../controllers/codigoController');

const router = express.Router();

router.get('/generar-codigo', generarCodigo);

module.exports = router;

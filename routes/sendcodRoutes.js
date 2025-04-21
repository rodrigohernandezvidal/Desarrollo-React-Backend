const express = require('express');
const router = express.Router();
const sendcodControllers = require('../controllers/sendcodController');

// Ruta para generar el código
router.get('/add', sendcodControllers.generateCode);

// Ruta para revertir el último código
router.delete('/last', sendcodControllers.decrementCode);

module.exports = router;

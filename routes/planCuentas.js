// routes/planCuentas.js
const express = require('express');
const router = express.Router();
const cuentasData = require('../Datas/planCuentas.json');

// Obtener todas las cuentas
router.get('/', (req, res) => {
  res.json(cuentasData);
});

// Obtener una cuenta por ID
router.get('/:id', (req, res) => {
  const cuenta = cuentasData.cuentas.find(c => c.id === parseInt(req.params.id));
  if (!cuenta) return res.status(404).send('Cuenta no encontrada');
  res.json(cuenta);
});

// Crear nueva cuenta
router.post('/', (req, res) => {
  const newId = Math.max(...cuentasData.cuentas.map(c => c.id)) + 1;
  const newCuenta = {
    id: newId,
    codigo: req.body.codigo,
    descripcion: req.body.descripcion,
    habilitada: req.body.habilitada,
    creado: new Date().toISOString().split('T')[0],
    actualizado: new Date().toISOString().split('T')[0]
  };
  cuentasData.cuentas.push(newCuenta);
  res.status(201).json(newCuenta);
});

// Actualizar cuenta
router.put('/:id', (req, res) => {
  const cuenta = cuentasData.cuentas.find(c => c.id === parseInt(req.params.id));
  if (!cuenta) return res.status(404).send('Cuenta no encontrada');
  
  cuenta.codigo = req.body.codigo;
  cuenta.descripcion = req.body.descripcion;
  cuenta.habilitada = req.body.habilitada;
  cuenta.actualizado = new Date().toISOString().split('T')[0];
  
  res.json(cuenta);
});

// Cambiar estado de habilitación
router.patch('/:id/toggle', (req, res) => {
  const cuenta = cuentasData.cuentas.find(c => c.id === parseInt(req.params.id));
  if (!cuenta) return res.status(404).send('Cuenta no encontrada');
  
  cuenta.habilitada = !cuenta.habilitada;
  cuenta.actualizado = new Date().toISOString().split('T')[0];
  
  res.json(cuenta);
});

// Exportar a Excel
router.get('/export/excel', (req, res) => {
  // Implementar lógica de exportación a Excel
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=plan-cuentas.xlsx');
  // ... generar archivo Excel
  res.send();
});

// Exportar a PDF
router.get('/export/pdf', (req, res) => {
  // Implementar lógica de exportación a PDF
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=plan-cuentas.pdf');
  // ... generar archivo PDF
  res.send();
});

module.exports = router;
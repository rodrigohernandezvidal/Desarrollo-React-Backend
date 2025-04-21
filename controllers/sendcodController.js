let currentCode = 1; // Código inicial, empezamos desde ENV001

// Función para generar el código
exports.generateCode = (req, res) => {
  let code = `ENV${String(currentCode).padStart(3, '0')}`; // Generamos el código con el formato ENV001, ENV002...

  // Si el código llega a 999, lo incrementamos para generar el siguiente
  if (currentCode === 999) {
    currentCode = 1000; // Cambiar el número de 999 a 1000
  } else {
    currentCode++; // Incrementar el código
  }
  console.log(`Código generado: ${code}`);
  res.json({ code }); // Devolver el código generado
};

// Función para restar el último código
exports.decrementCode = (req, res) => {
  if (currentCode > 1) {
    currentCode--; // Restamos el contador
    let code = `ENV${String(currentCode).padStart(3, '0')}`; // Generamos el código correspondiente
    console.log(`Código revertido a: ${code}`);
    res.json({ code }); // Devolvemos el nuevo código
  } else {
    console.error('No se puede decrementar más el código');
    res.status(400).json({ error: 'No se puede decrementar más el código' });
  }
};

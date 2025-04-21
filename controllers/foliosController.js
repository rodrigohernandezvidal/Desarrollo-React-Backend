// folioGenerator.js
// Contadores en memoria para los folios
const folios = {
    factura_electronica: 1000,
    factura_exenta: 5000,
    boleta_electronica: 8000,
  };
  
  // Función para generar el folio según el tipo de facturación
  const generarFolio = (tipo) => {
    if (!folios[tipo]) {
      throw new Error('Tipo de facturación no válido. Use: factura_electronica, factura_exenta o boleta_electronica.');
    }
  
    // Incrementar y devolver el folio correspondiente
    const folio = folios[tipo]++;
    return folio;
  };
  
  module.exports = { generarFolio };
  
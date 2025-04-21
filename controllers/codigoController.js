let codigoActual = 'AAA000';

function incrementarCodigo(codigo) {
  const letras = codigo.slice(0, 3); // Extraer las letras (ej. AAA)
  let numeros = parseInt(codigo.slice(3)); // Extraer los números (ej. 000)

  numeros += 1; // Incrementar los números
  if (numeros > 999) { // Si llega a 999, reiniciar y cambiar las letras
    numeros = 1;
    const letrasArray = letras.split('');
    for (let i = 2; i >= 0; i--) {
      if (letrasArray[i] === 'Z') {
        letrasArray[i] = 'A';
      } else {
        letrasArray[i] = String.fromCharCode(letrasArray[i].charCodeAt(0) + 1);
        break;
      }
    }
    return letrasArray.join('') + numeros.toString().padStart(3, '0');
  }
  return letras + numeros.toString().padStart(3, '0');
}

const generarCodigo = (req, res) => {
  codigoActual = incrementarCodigo(codigoActual);
  res.json({ codigo: codigoActual });
};

module.exports = { generarCodigo };
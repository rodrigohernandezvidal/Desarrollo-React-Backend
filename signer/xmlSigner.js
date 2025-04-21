const fs = require('fs');
const { SignedXml } = require('xml-crypto');
const crypto = require('crypto');
const path = require('path');

const signXML = (xmlData) => {
  // Cargar el archivo de certificado y clave privada NO DESMARCAR HASTA TENER CERTIFICADO Y CLAVES REALES
  //const privateKey = fs.readFileSync(path.resolve(__dirname, 'privateKey.pem'), 'utf8');
  //const certificate = fs.readFileSync(path.resolve(__dirname, 'certificate.cer'), 'utf8');

  // Crear una instancia de SignedXml
  //const sig = new SignedXml();

  // Firmar el XML
  //sig.signingKey = privateKey;  // Clave privada utilizada para firmar
  //sig.addReference("//*[local-name(.)='Documento']", ['http://www.w3.org/2000/09/xmldsig#enveloped-signature']);
  //sig.addReference("//*[local-name(.)='Encabezado']");

  // Datos de la firma digital (huella digital)
  //sig.keyInfoProvider = {
   // getKeyInfo: () => {
   //   return `<X509Data><X509Certificate>${certificate}</X509Certificate></X509Data>`;
   // }
  //};

  // Firmar el XML
  //sig.computeSignature(xmlData);
  //const signedXml = sig.getSignedXml();
    /*********SIMULADOR DE CERTIFICADO Y FIRMA*************/
    const secretKey = 'claveSecretaDePrueba'; // Aquí va tu clave secreta de prueba

  // Crear un hash SHA256 del XML
  const hash = crypto.createHmac('sha256', secretKey)
                     .update(xmlData)
                     .digest('hex');

  // Crear un XML simulado con la firma
  const signedXml = `${xmlData}<Signature>${hash}</Signature>`; // Se agrega la firma simulada al XML




  return signedXml;
};

module.exports = signXML;

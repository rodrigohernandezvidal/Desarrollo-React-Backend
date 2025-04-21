// generateCert.js
const forge = require('node-forge');
const fs = require('fs');

// Crear clave privada
const { privateKey, publicKey } = forge.pki.rsa.generateKeyPair(2048);

// Crear un certificado autofirmado
const cert = forge.pki.createCertificate();
cert.publicKey = publicKey;
cert.serialNumber = '01';
cert.validFrom = new Date();
cert.validTo = new Date();
cert.validTo.setFullYear(cert.validTo.getFullYear() + 1);

// Crear un atributo del sujeto para el certificado
cert.setSubject([
  { name: 'commonName', value: 'Firma Prueba' },
  { name: 'organizationName', value: 'Foog Technology' },
]);

// Autofirmar el certificado
cert.sign(privateKey);

// Guardar los archivos .pem
const privatePem = forge.pki.privateKeyToPem(privateKey);
const certPem = forge.pki.certificateToPem(cert);

fs.writeFileSync('./privateKey.pem', privatePem);
fs.writeFileSync('./certificate.pem', certPem);

console.log('Certificado y clave privada generados correctamente.');

require('dotenv').config(); // Cargar variables de entorno
const path = require('path');

module.exports = {
    privateKeyPath: path.join(__dirname, process.env.PRIVATE_KEY_PATH),
    certificatePath: path.join(__dirname, process.env.CERTIFICATE_PATH)
};

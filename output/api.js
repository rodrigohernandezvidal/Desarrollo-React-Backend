const express = require('express');
const http = require('http'); // Importar módulo HTTP
const socketIo = require('socket.io'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const multer = require('multer');
const forge = require('node-forge');
require('dotenv').config();


const dataController = require ("./controllers/dataController");
const menuController = require("./controllers/menuController");
const loginController = require("./controllers/authController");
const activeUsers = require("./controllers/authController");
const { generarFolio } = require("./controllers/foliosController");
const codigoRoutes = require('./routes/codigoRoutes');
const sendcodRoutes = require('./routes/sendcodRoutes');
const buildAndSignXML = require('./services/xmlBuilder');
const { handleBotRequest } = require ('./controllers/botController');
const config = require('./config');
const signService = require('./signService');
const logger = require('./logger');
const documentsRouter = require('./routes/documents');

dotenv.config();
const app = express();
const server = http.createServer(app); // Servidor HTTP

const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true);
  }, // Permitir solo este origen
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Middleware para habilitar CORS
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.json());// Middleware para parsear JSON en las peticiones
const userSocketMap = {};
const PRIVATE_KEY_PATH = process.env.PRIVATE_KEY_PATH;
const CERTIFICATE_PATH = process.env.CERTIFICATE_PATH;
const UPLOADS_DIR = process.env.UPLOADS_DIR;
const SIGNED_DIR = process.env.SIGNED_DIR;

const io = require ('socket.io')(server, {
  cors:{origin:'*'}
});
// Middleware para manejar errores
app.use((err, req, res, next) => {
  logger.error(`Error en la solicitud: ${err.message}`);
  
  res.status(err.status || 500).json({
      error: {
          message: err.message || 'Error interno del servidor',
          status: err.status || 500
      }
  });
});
/****************************************************************FIRMA ELECTRONICA AVANZADA*/
// Configurar almacenamiento de archivos
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });
/****************************************************************/
// Ruta para subir documentos
app.post('/api/upload', upload.single('document'), (req, res) => {
  res.json({ message: 'Documento subido correctamente', filename: req.file.filename });
});
/****************************************************************/
// Ruta para obtener documentos pendientes de firma
app.get('/api/documents', (req, res) => {
  fs.readdir('./uploads/', (err, files) => {
      if (err) {
          return res.status(500).json({ error: 'Error al obtener los documentos' });
      }
      res.json({ documents: files });
  });
});
/****************************************************************/
// Ruta para procesar la firma del cliente
app.post('/api/sign', (req, res, next) => {
  const { filename, email } = req.body;
  console.log(email);
  if (!filename || !email) {
      logger.warn('Intento de firma sin especificar archivo o email');
      return res.status(400).json({ error: 'Faltan datos para firmar el documento' });
  }

  // Llamar a signDocument sin enviar una respuesta adicional
  signService.signDocument(filename, email, res)
      .catch(error => {
          logger.error(`Error en la firma del documento: ${error.message}`);
          if (!res.headersSent) {
              res.status(500).json({ error: 'Error al firmar el documento' });
          }
      });
});
/****************************************************************/
// Ruta para verificar la firma del documento
app.post('/verify-signature', (req, res, next) => {
  const { filename } = req.body;
  if (!filename) {
      logger.warn('Intento de verificación sin especificar archivo.');
      return res.status(400).json({ error: 'Faltan datos para verificar la firma' });
  }

  try {
      const isValid = signService.verifySignature(filename);
      if (isValid) {
          res.json({ message: 'Firma válida.' });
      } else {
          res.status(400).json({ error: 'Firma inválida.' });
      }
  } catch (error) {
      next(error); 
  }
});
/****************************************************************KEY BOT*/
// Configura la API key de OpenAI
const openai = new OpenAI({
  apiKey: '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', // Reemplaza con tu clave API
});
/****************************************************************/
// Variables Globales
let receivedData = []; // Almacena los datos JSON recibidos
let pdfFiles = []; // Almacena los enlaces a los PDFs generados
const connectedUsers = new Map();

//Endpoints
app.get('/api/data/typeBilling',dataController.getTipoDocBilling);
app.post('/api/data/login', loginController.getLogin);
app.get('/api/active-users', activeUsers.getActiveUsers);
app.get('/api/data/billing',dataController.getBiiling);
app.post('/api/data/save-billing', dataController.saveBilling);
app.get('/api/data/billId/:id', dataController.getBillingById);
app.get('/api/data/client',dataController.getClient);
app.get('/api/data/signatories',dataController.getFirmantes);
app.get('/api/data/signatoriesId/:id', dataController.getFirmaRelacion);
app.get('/api/data/city',dataController.getCiudades);
app.get('/api/data/comunas',dataController.getComunas);
app.use('/api/codigo', codigoRoutes);
app.get('/api/menu', menuController.getMenuItems);
app.use('/api/codes', sendcodRoutes);
app.post('/api/bot', handleBotRequest);
app.get('/api/get-received-data', (req, res) => {
  return res.status(200).json(receivedData);
});
app.use('/api/documents', documentsRouter);
/****************************************************************/
io.on('connection', (socket) => {
  //Chat General
  console.log('Se ha conectado un cliente');
  socket.broadcast.emit('chat_message', {
    usuario: 'INFO',
    mensaje: 'Se ha conectado un nuevo usuario'
  })
  socket.on('chat_message', (data) => {
    io.emit('chat_message', data);
  });
  /****************************************************************/ 
   // Registrar usuario
   socket.on('register_user', (userId) => {
    if (!userId) {
      console.error("Error: userId no proporcionado para el registro.");
      return;
    }
    connectedUsers.set(socket.id, userId);
    userSocketMap[userId] = socket.id;
  });
  /****************************************************************/
  //Chat Privado
  socket.on('private_message', (data) => {
    const { remitente, destinatario, mensaje } = data;
    const destinatarioSocketId = userSocketMap[destinatario];
    if (destinatarioSocketId) {
      io.to(destinatarioSocketId).emit('private_message', {
        remitente,
        destinatario,
        mensaje,
      });
      console.log(`Mensaje enviado a ${destinatario} (socket ID: ${destinatarioSocketId})`);
    } else {
      console.error(`Destinatario ${destinatario} no encontrado.`);
    }
  });
  /****************************************************************/
  // NOTIFICACIONES EN TIEMPO REAL
  socket.on('send_notification', (data) => {
    const { mensaje } = data;
  console.log(mensaje);
    // Emitir la notificación a todos los usuarios
    io.emit('receive_notification', {
      mensaje, // Mensaje de la notificación
      timestamp: new Date().toISOString(), // Timestamp
    });
  
    console.log(`Notificación enviada a todos los usuarios: ${mensaje}`);
  });
 /****************************************************************/ 
  // Notificar a todos los usuarios
  socket.on('broadcast_notification', (data) => {
    io.emit('receive_notification', data);
    console.log("Notificación enviada a todos los usuarios.");
  });
  /****************************************************************/
  // Desregistrar usuario
  socket.on('unregister_user', (userId) => {
    if (userId && userSocketMap[userId]) {
      delete userSocketMap[userId];
      console.log(`Usuario ${userId} desregistrado.`);
    }
  });
  /****************************************************************/
   // Manejar desconexión
   socket.on('disconnect', () => {
    const userId = Object.keys(userSocketMap).find(key => userSocketMap[key] === socket.id);
    if (userId) {
      delete userSocketMap[userId]; // Eliminamos el usuario
      connectedUsers.delete(socket.id);
      console.log(`Usuario ${userId} desconectado y eliminado del mapa.`);
    }
  });
});
/****************************************************************/

app.get('/api/get-pdf-files', (req, res) => {
  return res.status(200).json(pdfFiles);
});
/****************************************************************/
app.post('/generate-pdf', async (req, res) => {
  try {
      let jsonData = req.body; // Recibir el JSON
      console.log('Datos recibidos:', jsonData);

      // Si jsonData es un array, toma el primer elemento
      if (Array.isArray(jsonData)) {
          jsonData = jsonData[0];
      }
      // Recupera template_id
      const tempId = jsonData['template_id']?.toLowerCase();
      console.log('---->'+tempId);
      if (!tempId) {
          return res.status(400).json({
            message: "El campo 'template_id' es obligatorio.",
          });
      }
      // Almacenar los datos en memoria
      receivedData.push(jsonData);
      // Convertir string a objeto JSON
      if (typeof jsonData.data === 'string') {
        try {
            jsonData.data = JSON.parse(jsonData.data); 
        } catch (error) {
            console.error('Error al parsear el campo data:', error.message);
            return res.status(400).json({
                message: 'El campo data no es un JSON válido',
                error: error.message,
            });
        }
      } 
      console.log('datos nuevo<<<<<<', jsonData)
      console.log('Usando templateId>>>>>>>:', tempId);
      // Generar PDF directamente
      const url = 'https://api.craftmypdf.com/v1/create';
      const apiKey = process.env.apiKeyCraft;
      const data = { data: jsonData.data,template_id: tempId };
      try {
          // Llamada a la API de generación de PDFs
          const response = await axios.post(url, data, {
            headers: {
              'X-API-KEY': apiKey,
              'Content-Type': 'application/json',
            },
         });
         const pdfLink = response.data.file; // PDF generado
         const pdfInfo = {
            pdfLink
         };
         pdfFiles.push(pdfInfo); 
         console.log('PDF generado:', pdfInfo);
         // Responder al cliente con el PDF generado
         return res.status(200).json({
            message: 'JSON recibido y PDF generado exitosamente',
            pdfInfo: {
                pdfLink,
                templateId: tempId,
                receivedData: jsonData,
            },
        });
      } catch (error) {
        console.error('Error al generar el PDF:', error.response?.data || error.message);
        return res.status(500).json({
            message: 'Error al generar el PDF',
            error: error.response?.data || error.message,
        });
      }
    } catch (error) {
      console.error('Error al procesar los datos:', error.message);
      return res.status(500).json({
           message: 'Error al procesar los datos',
           error: error.message,
      });
    }
  });
  // Ruta para procesar la firma del cliente
app.post('/sign', (req, res) => {
    const { filename, email } = req.body;
    if (!filename || !email) {
        return res.status(400).json({ error: 'Faltan datos para firmar el documento' });
    }
    
    const signedPath = `./signed/${filename}`;
    fs.copyFile(`./uploads/${filename}`, signedPath, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al firmar el documento' });
        }
        res.json({ message: 'Documento firmado correctamente', signedFile: signedPath });
    });
});

/****************************************************************/
 // Endpoint para obtener un folio por tipo de facturación
app.post('/api/generar-folio', (req, res) => {
  const { tipo } = req.body;

  try {
    const folio = generarFolio(tipo); // Generar el folio usando la función importada
    res.status(200).json({ tipo, folio });
  } catch (err) {
    res.status(400).json({
      error: err.message, // Enviar el mensaje de error si el tipo no es válido
    });
  }
}); 
/****************************************************************/
// 1. Recibir JSON del cliente Angular
app.post('/api/receive-json', async (req, res) => {
  try {
      let jsonData = req.body; // Recibir el JSON
      console.log('Datos recibidos:', jsonData);

       // Si jsonData es un array, toma el primer elemento
      if (Array.isArray(jsonData)) {
        jsonData = jsonData[0];
      }

      // Recupera template_id
      const templateId = jsonData['ID Tamplate']?.toLowerCase();
      console.log('---->'+templateId)
             
      // Almacenar los datos en memoria
      receivedData.push(jsonData);

      // Generar PDF directamente
      const url = 'https://api.craftmypdf.com/v1/create';
      const apiKey = '9008MTIxOjE1NDg4OnFjNkhjcWp5MW02VWlMblE'; // Reemplaza con tu clave API
      //const data = { data: jsonData, template_id: 'aae77b23b05f2784' };
      //const data = { data: jsonData, template_id: 'e3977b2341af7fce' };
      const data = { data: jsonData, template_id: templateId };

      try {
          // Llamada a la API de generación de PDFs
          const response = await axios.post(url, data, {
              headers: {
                  'X-API-KEY': apiKey,
                  'Content-Type': 'application/json',
              },
          });

          const pdfLink = response.data.file; // PDF generado
          const pdfInfo = {
            pdfLink,
            tipoDocumento: jsonData["Titulo_documento"],
            nombreUsuario: jsonData["A7"] +' '+jsonData["A8"],
            rutUsuario: jsonData["A6"]
          }
          pdfFiles.push(pdfInfo); // Guardar el enlace del PDF
          console.log('PDF generado:', pdfInfo);
          // Responder al cliente con el PDF generado
          return res.status(200).json({
              message: 'JSON recibido y PDF generado exitosamente',
              pdfInfo: pdfInfo,
          });
      } catch (error) {
          console.error('Error al generar el PDF:', error.message);
          return res.status(500).json({
              message: 'Error al generar el PDF',
              error: error.message,
          });
      }
  } catch (error) {
      console.error('Error al procesar los datos:', error.message);
      return res.status(500).json({
          message: 'Error al procesar los datos',
          error: error.message,
      });
  }
});
/****************************************************************/
app.post('/generate-dte', (req, res) => {
  try {
    const dteData = req.body;
    console.log('Datos recibidos en el backend:', dteData);

    // Generar el XML firmado
    const signedXml = buildAndSignXML(dteData);

    // Definir ruta y guardar el archivo XML
    const filePath = path.join(__dirname, 'output', 'factura.xml');
    fs.writeFileSync(filePath, signedXml);

    console.log('XML generado y guardado en:', filePath);

    // Enviar solo la URL del XML al frontend
    return res.json({ xmlLink: `http://localhost:3000/output/factura.xml` });
    //return res.json({ xmlLink: `http://18.217.212.150:3000/output/factura.xml` });

} catch (error) {
    console.error('Error en generate-dte:', error);

    if (!res.headersSent) {
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
}
});

// Servir archivos estáticos en la carpeta "output"
app.use('/output',  (req, res, next) => {
  res.setHeader('Content-Type', 'application/xml'); 
  next();
}, express.static(path.join(__dirname, 'output')));

/****************************************************************/
app.get('/download-xml', (req, res) => {
  const filePath = './output/factura.xml';  // Ruta al archivo XML

  // Verificamos si el archivo existe
  if (fs.existsSync(filePath)) {
      res.download(filePath, 'factura.xml', (err) => {
          if (err) {
              console.error('Error al descargar el archivo:', err);
              res.status(500).send('Error al descargar el archivo');
          }
      });
  } else {
      res.status(404).send('Archivo no encontrado');
  }
});
/****************************************************************/
// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)
});
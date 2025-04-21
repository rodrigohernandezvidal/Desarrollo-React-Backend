//controllers/autController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { io } = require('../api');
const { sendNotification } = require("./notificationsController");


// Datos simulados de usuario (esto generalmente debería ser traído de una base de datos)
const users = [
  {
    id:'01',
    email: 'rodrigo.hernandez@lbo.cl',
    password: '$2a$10$ZYaV19B8ITOVsh5h.Pt9SOLO68uz5wM1c2ctw5.WHbYdYj8w/J/Uq', // Contraseña '123456' encriptada '
    active: true,
    name: 'Rodrigo Hernandez Vidal',
    avatar: 'https://randomuser.me/api/portraits/men/69.jpg',
    admin: 'S',
    pertenece: 'S'
  },
  {
    id:'02',
    email: 'felipe.saldias@lbo.cl',
    password: '$2a$10$EJ8eD7JG8x3ADlGvMhX6LulvH3WabQlFoRlYI3bJh/Te8sU2UMmqW',
    active: true,
    name: 'Felipe Saldias',
    avatar:'https://randomuser.me/api/portraits/men/1.jpg',
    admin: 'N',
    pertenece: 'S'
    
  },
  {
    id:'03',
    email: 'sofia.jimenez@lbo.cl',
    password: '$2a$10$EJ8eD7JG8x3ADlGvMhX6LulvH3WabQlFoRlYI3bJh/Te8sU2UMmqW',
    active: true,
    name: 'Sofia Jimenez',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    admin: 'N',
    pertenece: 'S'
    
  },
  {
    id:'04',
    email: 'almendra.negrete@lbo.cl',
    password: '$2a$10$EJ8eD7JG8x3ADlGvMhX6LulvH3WabQlFoRlYI3bJh/Te8sU2UMmqW',
    active: true,
    name: 'Almendra Negrete',
    avatar:'https://randomuser.me/api/portraits/women/68.jpg',
    admin: 'N',
    pertenece: 'S'
    
  },
  {
    id:'05',
    email: 'barbara.hernandez@lbo.cl',
    password: '$2a$10$EJ8eD7JG8x3ADlGvMhX6LulvH3WabQlFoRlYI3bJh/Te8sU2UMmqW',
    active: true,
    name: 'Barbara Hernandez',
    avatar:'https://randomuser.me/api/portraits/women/60.jpg',
    admin: 'N',
    pertenece: 'S'
    
  }
];

const Firmantes =[
  {
    id:'01',
    email: 'fabiolaosea@rolimafa.cl',
    password: '$2a$10$ZYaV19B8ITOVsh5h.Pt9SOLO68uz5wM1c2ctw5.WHbYdYj8w/J/Uq', // Contraseña '123456' encriptada '
    active: true,
    name: 'Fabiola Osea',
    admin: 'N',
    Empresa: 'ROLIMAFA Spa',
    pertenece: 'N'
  }

]

// Función para manejar el login
async function getLogin(req, res) {
  const { email, password } = req.body;
  

  // 1. Validación de los datos de entrada
  if (!email || !password) {
    return res.status(400).json({ message: 'El correo electrónico y la contraseña son obligatorios.' });
  }

  // Validar formato del email
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Formato de correo electrónico inválido.' });
  }

  // 2. Buscar el usuario por el email
  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(400).json({ message: 'Credenciales incorrectas' });
  }


  // 3. Verificar si el usuario está activo
  if (!user.active) {
    return res.status(403).json({ message: 'El usuario está deshabilitado.' });
  }

  // 4. Comparar la contraseña encriptada con bcrypt usando async/await
  try {
    console.log("Contraseña ingresada: ", password); // Contraseña que el usuario introduce
    console.log("Contraseña almacenada (encriptada): ", user.password); // Contraseña encriptada almacenada

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("¿La contraseña coincide?", isMatch); // True si las contraseñas coinciden

    //if (!isMatch) {
     // return res.status(400).json({ message: 'Credenciales incorrectas' });
    //}

    // 5. Generar el JWT con un tiempo de expiración de 1 hora
    const token = jwt.sign(
      { email: user.email, name: user.name, avatar: user.avatar, id: user.id, empresa: 'S'},
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    sendNotification(io, user.name, "¡Has iniciado sesión con éxito! 🎉");
    // 6. Enviar el token al cliente
    return res.json({ message: 'Login exitoso', token });

  } catch (err) {
    console.error("Error durante el proceso de login:", err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

// Función para obtener los usuarios activos, excluyendo al usuario logueado
async function getActiveUsers(req, res) {
  const token = req.headers.authorization?.split(' ')[1]; // Extraer el token del encabezado
console.log(token);
  if (!token) {
    return res.status(403).json({ message: 'Token de autenticación requerido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const loggedInEmail = decoded.email; // Obtener el email del usuario logueado

    // Filtrar los usuarios activos, excluyendo al usuario logueado
    const activeUsers = users.filter(user => user.active && user.email !== loggedInEmail);

    return res.json(activeUsers); // Retornar los usuarios activos
  } catch (err) {
    console.error("Error al verificar el token:", err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}


// Función para manejar el login de Clientes firmantes
async function getLoginClients(req, res) {
  const { emailClient, tokenClient } = req.body;
  

  // 1. Validación de los datos de entrada
  if (!emailClient || !tokenClient) {
    return res.status(400).json({ message: 'El correo electrónico y la contraseña son obligatorios.' });
  }

  // Validar formato del email
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(emailClient)) {
    return res.status(400).json({ message: 'Formato de correo electrónico inválido.' });
  }

  // 2. Buscar el usuario por el email
  const firmate = Firmantes.find((firmate) => firmate.email === emailClient);
  if (!firmate) {
    return res.status(400).json({ message: 'Credenciales incorrectas' });
  }


  // 3. Verificar si el usuario está activo
  if (!firmate.active) {
    return res.status(403).json({ message: 'El usuario está deshabilitado.' });
  }

  // 4. Comparar la contraseña encriptada con bcrypt usando async/await
  try {
    //console.log("Contraseña ingresada: ", tokenClient); // Contraseña que el usuario introduce
    //console.log("Contraseña almacenada (encriptada): ", firmate.password); // Contraseña encriptada almacenada

    const isMatch = await bcrypt.compare(tokenClient, firmate.password);
    //console.log("¿La contraseña coincide?", isMatch); // True si las contraseñas coinciden

    //if (!isMatch) {
     // return res.status(400).json({ message: 'Credenciales incorrectas' });
    //}

    // 5. Generar el JWT con un tiempo de expiración de 1 hora
    const token = jwt.sign(
      { email: firmate.email, name: firmate.name,  id: firmate.id, empresa: 'N'},
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    sendNotification(io, firmate.name, "¡Has iniciado sesión con éxito! 🎉");
    // 6. Enviar el token al cliente
    return res.json({ message: 'Login exitoso', token });

  } catch (err) {
    console.error("Error durante el proceso de login:", err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

module.exports = { getLogin, getActiveUsers, getLoginClients };

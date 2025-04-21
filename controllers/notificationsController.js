const userSocketMap = {}; // Mapa de usuarios conectados

const registerUser = (socket, userId) => {
  if (!userId) {
    console.error("Error: userId no proporcionado para el registro.");
    return;
  }
  userSocketMap[userId] = socket.id;
  console.log(`Usuario ${userId} registrado con socket ID ${socket.id}`);
};

const sendNotification = (io, userId, message) => {
  const userSocketId = userSocketMap[userId];
  if (userSocketId) {
    io.to(userSocketId).emit("notification", message);
    console.log(`Notificación enviada a ${userId}:`, message);
  } else {
    console.warn(`Usuario ${userId} no está conectado.`);
  }
};

const handleDisconnect = (socket) => {
  const userId = Object.keys(userSocketMap).find((key) => userSocketMap[key] === socket.id);
  if (userId) {
    delete userSocketMap[userId];
    console.log(`Usuario ${userId} desconectado.`);
  }
};

module.exports = {
  registerUser,
  sendNotification,
  handleDisconnect,
};

const responses = require("../services/responses");
const stringSimilarity = require("string-similarity");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer(); // Asegurar que tokenizer está definido

const normalizeText = (text) => {
  if (!text || typeof text !== "string") return ""; // Evitar errores si es undefined o null
  return text.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// Función para limpiar la página (remover el "/")
const normalizePage = (page) => (page && page.startsWith("/") ? page.substring(1) : page || "");

const processMessage = (message) => tokenizer.tokenize(normalizeText(message)).join(" ");

const handleBotRequest = async (req, res) => {
  const { message, page } = req.body; // CORREGIDO: antes usabas processMessage en la desestructuración

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "El mensaje debe ser un texto válido" });
  }

  const cleanedPage = normalizePage(page);
  const normalizedMessage = processMessage(message); // CORREGIDO: ahora usa la función correcta

  console.log("Página limpia:", cleanedPage);
  console.log("Mensaje recibido:", message);

  let response;

  //  Primero, verifica si el mensaje está en las respuestas predefinidas (saludos, frases generales)
  if (responses.predefined[normalizedMessage]) {
    response = responses.predefined[normalizedMessage];
  }
  //  Si no está en las predefinidas, busca en las respuestas de la página actual
  else if (responses[cleanedPage]) {
    const pageResponses = responses[cleanedPage];

    // Extrae todas las preguntas posibles
    const questions = pageResponses.map((res) => normalizeText(res.question));

    // Encuentra la mejor coincidencia
    const bestMatch = stringSimilarity.findBestMatch(normalizedMessage, questions);

    // Si la mejor coincidencia tiene una similitud alta (mayor a 0.6), la usa
    if (bestMatch.bestMatch.rating > 0.6) {
      const bestQuestionIndex = bestMatch.bestMatchIndex;
      response = pageResponses[bestQuestionIndex].answer;
    } else {
      response = "Lo siento, no entiendo esa pregunta. ¿Puedes ser más específico?";
    }
  }
  // Si no hay coincidencias, devuelve la respuesta genérica
  else {
    response = "Lo siento, no entiendo esa pregunta. ¿Puedes ser más específico?";
  }

  res.json({ response });
};

module.exports = { handleBotRequest };

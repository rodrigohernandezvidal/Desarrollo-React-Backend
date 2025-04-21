const express = require("express");
const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Ruta para generar documentos predefinidos
router.post("/generate-documents", async (req, res) => {
  const { firmante } = req.body; // Datos del firmante

  if (!firmante) {
    return res.status(400).json({ error: "Datos del firmante no proporcionados" });
  }

  try {
    // Cargar las plantillas de documentos
    console.log("Cargando plantilla de mandato...");
    const mandatoTemplate = fs.readFileSync(path.join(__dirname, "../templates/mandato.pdf"));
    console.log("Plantilla de mandato cargada correctamente.");

    console.log("Cargando plantilla de contrato...");
    const contratoTemplate = fs.readFileSync(path.join(__dirname, "../templates/contrato.pdf"));
    console.log("Plantilla de contrato cargada correctamente.");

    console.log("Cargando plantilla de cotización...");
    const cotizacionTemplate = fs.readFileSync(path.join(__dirname, "../templates/cotizacion.pdf"));
    console.log("Plantilla de cotización cargada correctamente.");

    // Función para rellenar un documento
    const fillDocument = async (template, firmante) => {
      const pdfDoc = await PDFDocument.load(template);
      const form = pdfDoc.getForm();

      // Rellenar campos (asumiendo que los campos tienen nombres específicos)
      console.log("Rellenando campos del documento...");
      form.getTextField("Nombre").setText(firmante.name);
      form.getTextField("Identificacion").setText(firmante.identification);
      form.getTextField("Direccion").setText(firmante.address);
      form.getTextField("Fecha").setText(new Date().toLocaleDateString());

      const pdfBytes = await pdfDoc.save();
      return pdfBytes;
    };

    // Generar los documentos rellenados
    console.log("Generando mandato...");
    const mandatoFilled = await fillDocument(mandatoTemplate, firmante);
    console.log("Mandato generado correctamente.");

    console.log("Generando contrato...");
    const contratoFilled = await fillDocument(contratoTemplate, firmante);
    console.log("Contrato generado correctamente.");

    console.log("Generando cotización...");
    const cotizacionFilled = await fillDocument(cotizacionTemplate, firmante);
    console.log("Cotización generada correctamente.");

    // Devolver los documentos generados
    res.json({
        mandato: Buffer.from(mandatoFilled).toString("base64"),
        contrato: Buffer.from(contratoFilled).toString("base64"),
        cotizacion: Buffer.from(cotizacionFilled).toString("base64"),
      });
  } catch (error) {
    console.error("Error al generar los documentos:", error);
    res.status(500).json({ error: "Error al generar los documentos" });
  }
});

module.exports = router;
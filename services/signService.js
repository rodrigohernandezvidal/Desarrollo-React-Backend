const fs = require('fs');
const forge = require('node-forge');
const config = require('../utils/config');
const logger = require('../utils/logger');
const { PDFDocument, rgb } = require('pdf-lib');
const PDFKit = require('pdfkit');
const QRCode = require("qrcode");
const path = require('path');

async function signDocument(filename, email, nombre, isSimpleSignature = false) {
    const basePath = path.join(__dirname, '..');
    const originalPath = path.join(basePath, 'uploads', filename);
    const signedPath = path.join(basePath, 'signed', `final_${filename}`);
    const documentsFilePath = path.join(basePath, 'documents.json');
    
    console.log(`Proceso de firma iniciado para: ${filename}`);

    try {
        if (!fs.existsSync(originalPath)) {
            throw new Error(`Archivo original no encontrado: ${originalPath}`);
        }

        const documentsData = JSON.parse(fs.readFileSync(documentsFilePath, 'utf-8'));
        const documentIndex = documentsData.findIndex(doc => doc.filename === filename);
        
        if (documentIndex === -1) {
            throw new Error('Documento no registrado en el sistema');
        }

        const document = documentsData[documentIndex];
        const firmantes = Array.isArray(document.firmantes) ? document.firmantes : [];

        const pdfBytes = fs.readFileSync(originalPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        
        // Generar hash único para el documento
        const fileHash = forge.md.sha256.create().update(pdfBytes).digest().toHex();
        const now = new Date();
        const fechaHora = `${now.toLocaleDateString("es-ES")} ${now.toLocaleTimeString("es-ES")}`;
        const footerText = `Código de verificación: ${fileHash} - ${fechaHora}`;

        // Agregar footer a todas las páginas existentes
        const pages = pdfDoc.getPages();
        for (const page of pages) {
            const { width, height } = page.getSize();
            page.drawText(footerText, {
                x: 50,
                y: 30,
                size: 8,
                color: rgb(0.5, 0.5, 0.5),
            });
        }

        // Crear página de firmas con el mismo tamaño que la primera página
        const firstPage = pages[0];
        const signaturePage = pdfDoc.addPage([firstPage.getWidth(), firstPage.getHeight()]);
        
        // Agregar footer también a la página de firmas
        signaturePage.drawText(footerText, {
            x: 50,
            y: 30,
            size: 8,
            color: rgb(0.5, 0.5, 0.5),
        });

        let yPosition = firstPage.getHeight() - 100;
        const pageWidth = signaturePage.getWidth();

        // Procesar cada firmante
        for (const [index, firmante] of firmantes.entries()) {
            const signed = firmante.signed || firmante.email === email;
            const date = signed ? (firmante.signatureDate ? new Date(firmante.signatureDate) : new Date()) : null;

            // Texto de la firma
        signaturePage.drawText(`Firmante ${index + 1}: ${firmante.name || firmante.email}`, {
            x: 50,
            y: yPosition,
            size: 12,
            color: rgb(0, 0, 0),
        });
        
        signaturePage.drawText(`Estado: ${signed ? 'FIRMADO' : 'PENDIENTE'}`, {
            x: 50,
            y: yPosition - 20,
            size: 10,
            color: signed ? rgb(0, 0.5, 0) : rgb(0.5, 0, 0),
        });
        
        if (signed) {
            signaturePage.drawText(`Fecha: ${date.toLocaleDateString("es-ES")}`, {
                x: 50,
                y: yPosition - 40,
                size: 10,
                color: rgb(0, 0, 0),
            });
            
            signaturePage.drawText(`Hora: ${date.toLocaleTimeString("es-ES")}`, {
                x: 50,
                y: yPosition - 60,
                size: 10,
                color: rgb(0, 0, 0),
            });

                try {
                    const qrData = [
                        `Documento: ${filename}`,
                        `Firmante: ${firmante.name || firmante.email}`,
                        `Fecha: ${date.toLocaleDateString("es-ES")}`,
                        `Hora: ${date.toLocaleTimeString("es-ES")}`,
                        `Hash: ${fileHash}`
                    ].join('\n');
                    
                    const qrImage = await QRCode.toBuffer(qrData);
                    const qrImageEmbed = await pdfDoc.embedPng(qrImage);
                    signaturePage.drawImage(qrImageEmbed, {
                        x: pageWidth - 120,
                        y: yPosition - 60,
                        width: 80,
                        height: 80,
                    });
                } catch (qrError) {
                    console.error('Error generando QR:', qrError);
                }
            }
            
            yPosition -= 100;
        }

        // Aplicar firma digital
        const privateKeyPem = fs.readFileSync(process.env.PRIVATE_KEY_PATH, 'utf8');
        const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
        
        const pdfBytesToSign = await pdfDoc.save();
        const md = forge.md.sha256.create();
        md.update(pdfBytesToSign);
        const signature = privateKey.sign(md);
        
        fs.writeFileSync(path.join(basePath, 'signed', `${filename}.sig`), signature);

        // Guardar PDF firmado
        const signedPdfBytes = await pdfDoc.save();
        fs.writeFileSync(signedPath, signedPdfBytes);

        // Actualizar estado del documento
        const allSigned = firmantes.every(f => f.signed || f.email === email);
        if (allSigned || isSimpleSignature) {
            fs.unlinkSync(originalPath);
            console.log(`Documento original eliminado: ${originalPath}`);
        }

        return signedPath;
    } catch (error) {
        console.error('Error en signDocument:', error);
        throw error;
    }
}

function verifySignature(filename) {
    try {
        logger.info(`Iniciando verificación de firma: ${filename}`);

        const filePath = `${process.env.SIGNED_DIR}/${filename}`;
        const signaturePath = `${process.env.SIGNED_DIR}/${filename}.sig`;

        if (!fs.existsSync(filePath)) {
            throw new Error(`El archivo ${filename} no existe.`);
        }
        if (!fs.existsSync(signaturePath)) {
            throw new Error(`La firma para ${filename} no existe.`);
        }

        const fileBuffer = fs.readFileSync(filePath);
        const signature = Buffer.from(fs.readFileSync(signaturePath, 'binary'), 'binary');

        const certificatePem = fs.readFileSync(config.certificatePath, 'utf8');
        const certificate = forge.pki.certificateFromPem(certificatePem);
        
        const md = forge.md.sha256.create();
        md.update(fileBuffer.toString('binary'));
        const fileHash = Buffer.from(md.digest().bytes(), 'binary');

        const isValid = certificate.publicKey.verify(fileHash, signature);

        if (isValid) {
            logger.info(`Firma válida: ${filename}`);
        } else {
            logger.warn(`Firma inválida: ${filename}`);
        }

        return isValid;
    } catch (error) {
        logger.error(`Error en la verificación de firma de ${filename}: ${error.message}`);
        throw error;
    }
}

module.exports = { signDocument, verifySignature };
const fs = require('fs');
const xml2js = require('xml2js');
const signXML = require('../signer/xmlSigner');
const { X509Certificate } = require('crypto');

// Función para generar el XML a partir de los datos proporcionados y guardarlo
const buildAndSignXML = (data) => {

    function removeDots(value){
        return value.toString().replace(/\./g, '');
    }
    const builder = new xml2js.Builder({
        xmldec: { version: '1.0', encoding: 'ISO-8859-1' },
        renderOpts: { pretty: true, indent: '  ', newline: '\n' }
    });

    const detallesArray = Array.isArray(data.detalles) ? data.detalles : [];
    // Generamos el XML con la estructura correcta
    const xmlData = {
        EnvioDTE: {
            $: {
                xmlns: "http://www.sii.cl/SiiDte",
                "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "xsi:schemaLocation": "http://www.sii.cl/SiiDte EnvioDTE_v10.xsd",
                version: "1.0"
            },
            SetDTE: {
                $: { ID: "SetDoc" },
                Caratula: {
                    $: { version: "1.0" },
                    RutEmisor: removeDots(data.rutEmisor) || "97975000-5",
                    RutEnvia: removeDots(data.rutEnvia) || "7880442-4",
                    RutReceptor: removeDots(data.rutReceptor) || "60803000-K",
                    FchResol: data.fchResol || "2003-09-02",
                    NroResol: data.nroResol || "0",
                    TmstFirmaEnv: new Date().toISOString(),
                    SubTotDTE: {
                        TpoDTE: data.tipoDte || "33",
                        NroDTE: data.nroDTE
                    }
                },// FIN CARATULA
                DTE: {
                    $:{version:'1.0'},
                    Documento:{
                        $: {ID:'F60T33'},
                            Encabezado: {
                                IdDoc: {
                                    TipoDTE: data.tipoDte,
                                    Folio: data.folio,
                                    FchEmis: data.fchEmis
                                },
                                Emisor: {
                                    RUTEmisor: removeDots(data.rutEmisor),
                                    RznSoc: data.rznSoc,
                                    GiroEmis: data.giroEmis,
                                    Acteco: data.acteco,
                                    CdgSIISucur: data.cdgSIISucur,
                                    DirOrigen: data.dirOrigen,
                                    CmnaOrigen: data.cmnaOrigen,
                                    CiudadOrigen: data.ciudadOrigen
                                },
                                Receptor: {
                                    RUTRecep: removeDots(data.rutRecep),
                                    RznSocRecep: data.rznSocRecep,
                                    GiroRecep: data.giroRecep,
                                    DirRecep: data.dirRecep,
                                    CmnaRecep: data.cmnaRecep,
                                    CiudadRecep: data.ciudadRecep
                                },
                                Totales: {
                                    MntNeto: removeDots(data.mntNeto),
                                    TasaIVA: removeDots(data.tasaIVA),
                                    IVA: removeDots(data.iva),
                                    MntTotal: removeDots(data.mntTotal)
                                }
                            },// FIN ENCABEZADO
                            Detalle: data.detalles.map((detalle, index) => ({
                                NroLinDet: index + 1, // Número de línea del detalle
                                NmbItem: detalle.NmbItem, // Nombre del producto
                                QtyItem: detalle.QtyItem, // Cantidad
                                PrcItem: removeDots(detalle.PrcItem), // Precio unitario
                                MontoItem: removeDots(detalle.MontoItem) // Monto total del ítem
                            })) , 
                            TED:{
                                $:{version:'1.0'},
                                DD:{
                                    RE:  removeDots(data.re),
                                    TD:  data.td,
                                    F:   data.f,
                                    FE:  data.fe,
                                    RR:  removeDots(data.rr),
                                    RSR: data.rsr,
                                    MNT: removeDots(data.mnt),
                                    IT1: data.it1,
                                    CAF:{
                                        $:{version:'1.0'},
                                        DA:{
                                            RE: removeDots(data.re),
                                            RS: data.rs,
                                            TD: data.td,
                                            RNG:{
                                                D: data.d,
                                                H: data.h,
                                            },
                                            FA: data.fa,
                                            RSAPK:{
                                                M: '0a4O6Kbx8Qj3K4iWSP4w7KneZYeJ+g/prihYtIEolKt3cykSxl1zO8vSXu397QhTmsX7SBEudTUx++2zDXBhZw==',//(Modulus): Es el módulo de la clave pública RSA, codificado en Base64.
                                                E: 'Aw==',//(Exponent): Es el exponente de la clave pública RSA, también en Base64. Función: Representa la clave pública utilizada para validar la firma digital de los documentos electrónicos.
                                            },
                                            IDK:'100',//Es un identificador numérico asociado a la clave pública utilizada en la firma digital.
                                        },// FIN DA
                                        FRMA: {
                                            $: {
                                                "algoritmo": "SHA1withRSA"
                                            },"_": "g1AQX0sy8NJugX52k2hTJEZAE9Cuul6pqYBdFxj1N17umW7zG/hAavCALKByHzdYAfZ3LhGTXCai5zNxOo4lDQ=="
                                        }
                                    },// FIN CAF
                                    TSTED:new Date().toISOString(),//Es la fecha y hora en que se generó el Timbre Electrónico Digital (TED), que garantiza la autenticidad del documento.
                                },// FIN DD
                                FRMT:{
                                    $:{"algoritmo": "SHA1withRSA"//Es la firma digital del Documento Tributario Electrónico (DTE), generada con la clave privada del emisor.
                                    },"_":"GbmDcS9e/jVC2LsLIe1iRV12Bf6lxsILtbQiCkh6mbjckFCJ7fj/kakFTS06Jo8iS4HXvJj3oYZuey53Krniew==",
                                }
                            },// FIN TED
                            TmstFirma:new Date().toISOString(),//Es la fecha y hora en que se firmó electrónicamente el DTE.
                    },// FIN FDOCUMENTO 
                    Signature:{
                        $: {
                            xmlns: "http://www.w3.org/2000/09/xmldsig#"
                           },
                            SignedInfo:{
                                 CanonicalizationMethod: {$: {"Algorithm": "http://www.w3.org/TR/2001/REC-xml-c14n-20010315"}},  
                                 SignatureMethod: {$: {"Algorithm": "http://www.w3.org/2000/09/xmldsig#rsa-sha1"}},  
                                 Reference:{
                                    $:{URI:'#F60T33'},
                                    Transforms:{
                                        Transform: {$: {"Algorithm": "http://www.w3.org/TR/2001/REC-xml-c14n-20010315"}},     
                                    },
                                    DigestMethod: {$: {"Algorithm": "http://www.w3.org/2000/09/xmldsig#sha1"}}, 
                                    DigestValue: "hlmQtu/AyjUjTDhM3852wvRCr8w="
                                },// FIN REFERENCIA
                            },// FIN SIGNEDINFO
                            SignatureValue:'JG1Ig0pvSIH85kIKGRZUjkyX6CNaY08Y94j4UegTgDe8+wl61GzqjdR1rfOK9BGn93AMOo6aiAgolW0k/XklNVtM/ZzpNNS3d/fYVa1q509mAMSXbelxSM3bjoa7H6Wzd/mV1PpQ8zK5gw7mgMMP4IKxHyS92G81GEguSmzcQmA=',
                            KeyInfo:{
                                KeyValue:{
                                    RSAKeyValue:{
                                        Modulus: 'tNEknkb1kHiD1OOAWlLKkcH/UP5UGa6V6MYso++JB+vYMg2OXFROAF7G8BNFFPQxiuS/7y1azZljN2xq+bW3bAou1bW2ij7fxSXWTJYFZMAyndbLyGHM1e3nVmwpgEpxBHhZzPvwLb55st1wceuKjs2Ontb13J33sUb7bbJMWh0=',
                                        Exponent: 'AQAB'
                                    }
                                },//FIN KEYVALUE
                                X509Data:{
                                    X509Certificate:'MIIEgjCCA+ugAwIBAgIEAQAApzANBgkqhkiG9w0BAQUFADCBtTELMAkGA1UEBhMCQ0wxHTAbBgNVBAgUFFJlZ2lvbiBNZXRyb3BvbGl0YW5hMREwDwYDVQQHFAhTYW50aWFnbzEUMBIGA1UEChQLRS1DRVJUQ0hJTEUxIDAeBgNVBAsUF0F1dG9yaWRhZCBDZXJ0aWZpY2Fkb3JhMRcwFQYDVQQDFA5FLUNFUlRDSElMRSBDQTEjMCEGCSqGSIb3DQEJARYUZW1haWxAZS1jZXJ0Y2hpbGUuY2wwHhcNMDMxMDAxMTg1ODE1WhcNMDQwOTMwMDAwMDAwWjCBuDELMAkGA1UEBhMCQ0wxFjAUBgNVBAgUDU1ldHJvcG9saXRhbmExETAPBgNVBAcUCFNhbnRpYWdvMScwJQYDVQQKFB5TZXJ2aWNpbyBkZSBJbXB1ZXN0b3MgSW50ZXJub3MxDzANBgNVBAsUBlBpc28gNDEjMCEGA1UEAxQaV2lsaWJhbGRvIEdvbnphbGV6IENhYnJlcmExHzAdBgkqhkiG9w0BCQEWEHdnb256YWxlekBzaWkuY2wwgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBALxZlVh1xr9sKQIBDF/6Va+lsHQSG5AAmCWvtNTIOXN3E9EQCy7pOPHrDg6EusvoHyesZSKJbc0TnIFXZp78q7mbdHijzKqvMmyvwbdP7KK8LQfwf84W4v9O8MJeUHlbJGlo5nFACrPAeTtONbHaReyzeMDv2EganNEDJc9c+UNfAgMBAAGjggGYMIIBlDAjBgNVHREEHDAaoBgGCCsGAQQBwQEBoAwWCjA3ODgwNDQyLTQwCQYDVR0TBAIwADA8BgNVHR8ENTAzMDGgL6AthitodHRwOi8vY3JsLmUtY2VydGNoaWxlLmNsL2UtY2VydGNoaWxlY2EuY3JsMCMGA1UdEgQcMBqgGAYIKwYBBAHBAQKgDBYKOTY5MjgxODAtNTAfBgNVHSMEGDAWgBTgKP3S4GBPs0brGsz1CJEHcjodCDCB0AYDVR0gBIHIMIHFMIHCBggrBgEEAcNSBTCBtTAvBggrBgEFBQcCARYjaHR0cDovL3d3dy5lLWNlcnRjaGlsZS5jbC8yMDAwL0NQUy8wgYEGCCsGAQUFBwICMHUac0VsIHRpdHVsYXIgaGEgc2lkbyB2YWxpZG8gZW4gZm9ybWEgcHJlc2VuY2lhbCwgcXVlZGFuZG8gZWwgQ2VydGlmaWNhZG8gcGFyYSB1c28gdHJpYnV0YXJpbywgcGFnb3MsIGNvbWVyY2lvIHkgb3Ryb3MwCwYDVR0PBAQDAgTwMA0GCSqGSIb3DQEBBQUAA4GBABMfCyJF0mNXcov8iEWvjGFyyPTsXwvsYbbkOJ41wjaGOFMCInb4WY0ngM8BsDV22bGMs8oLyX7rVy16bGA8Z7WDUtYhoOM7mqXw/Hrpqjh3JgAf8zqdzBdH/q6mAbdvq/yb04JHKWPC7fMFuBoeyVWAnhmuMZfReWQiMUEHGGIW',
                                }
                            },//FIN KEYINFO    
                    }//FIN SIGNATURE
                }// FIN DTE
            }, // FIN SETDTE
            Signature:{
                $: {
                    xmlns: "http://www.w3.org/2000/09/xmldsig#"
                   },
                SignedInfo:{
                        CanonicalizationMethod: {$: {"Algorithm": "http://www.w3.org/TR/2001/REC-xml-c14n-20010315"}},  
                        SignatureMethod: {$: {"Algorithm": "http://www.w3.org/2000/09/xmldsig#rsa-sha1"}},  
                        Reference:{
                        $:{URI:'#F60T33'},
                        Transforms:{
                            Transform: {$: {"Algorithm": "http://www.w3.org/TR/2001/REC-xml-c14n-20010315"}},     
                        },
                        DigestMethod: {$: {"Algorithm": "http://www.w3.org/2000/09/xmldsig#sha1"}}, 
                        DigestValue: "4OTWXyRl5fw3htjTyZXQtYEsC3E="
                    },// FIN REFERENCIA
                },// FIN SIGNEDINFO
                SignatureValue:'sBnr8Yq14vVAcrN/pKLD/BrqUFczKMW3y1t3JOrdsxhhq6IxvS13SgyMXbIN/T9ciRaFgNabs3pi732XhcpeiSmD1ktzbRctEbSIszYkFJY49k0eB+TVzq3eVaQr4INrymfuOnWj78BZcwKuXvDy4iAcx6/TBbAAkPFwMP9ql2s=',
                KeyInfo:{
                    KeyValue:{
                        RSAKeyValue:{
                            Modulus: 'tNEknkb1kHiD1OOAWlLKkcH/UP5UGa6V6MYso++JB+vYMg2OXFROAF7G8BNFFPQxiuS/7y1azZljN2xq+bW3bAou1bW2ij7fxSXWTJYFZMAyndbLyGHM1e3nVmwpgEpxBHhZzPvwLb55st1wceuKjs2Ontb13J33sUb7bbJMWh0=',
                            Exponent: 'AQAB'
                        }
                    },//FIN KEYVALUE
                    X509Data:{
                        X509Certificate:'MIIEgjCCA+ugAwIBAgIEAQAApzANBgkqhkiG9w0BAQUFADCBtTELMAkGA1UEBhMCQ0wxHTAbBgNVBAgUFFJlZ2lvbiBNZXRyb3BvbGl0YW5hMREwDwYDVQQHFAhTYW50aWFnbzEUMBIGA1UEChQLRS1DRVJUQ0hJTEUxIDAeBgNVBAsUF0F1dG9yaWRhZCBDZXJ0aWZpY2Fkb3JhMRcwFQYDVQQDFA5FLUNFUlRDSElMRSBDQTEjMCEGCSqGSIb3DQEJARYUZW1haWxAZS1jZXJ0Y2hpbGUuY2wwHhcNMDMxMDAxMTg1ODE1WhcNMDQwOTMwMDAwMDAwWjCBuDELMAkGA1UEBhMCQ0wxFjAUBgNVBAgUDU1ldHJvcG9saXRhbmExETAPBgNVBAcUCFNhbnRpYWdvMScwJQYDVQQKFB5TZXJ2aWNpbyBkZSBJbXB1ZXN0b3MgSW50ZXJub3MxDzANBgNVBAsUBlBpc28gNDEjMCEGA1UEAxQaV2lsaWJhbGRvIEdvbnphbGV6IENhYnJlcmExHzAdBgkqhkiG9w0BCQEWEHdnb256YWxlekBzaWkuY2wwgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBALxZlVh1xr9sKQIBDF/6Va+lsHQSG5AAmCWvtNTIOXN3E9EQCy7pOPHrDg6EusvoHyesZSKJbc0TnIFXZp78q7mbdHijzKqvMmyvwbdP7KK8LQfwf84W4v9O8MJeUHlbJGlo5nFACrPAeTtONbHaReyzeMDv2EganNEDJc9c+UNfAgMBAAGjggGYMIIBlDAjBgNVHREEHDAaoBgGCCsGAQQBwQEBoAwWCjA3ODgwNDQyLTQwCQYDVR0TBAIwADA8BgNVHR8ENTAzMDGgL6AthitodHRwOi8vY3JsLmUtY2VydGNoaWxlLmNsL2UtY2VydGNoaWxlY2EuY3JsMCMGA1UdEgQcMBqgGAYIKwYBBAHBAQKgDBYKOTY5MjgxODAtNTAfBgNVHSMEGDAWgBTgKP3S4GBPs0brGsz1CJEHcjodCDCB0AYDVR0gBIHIMIHFMIHCBggrBgEEAcNSBTCBtTAvBggrBgEFBQcCARYjaHR0cDovL3d3dy5lLWNlcnRjaGlsZS5jbC8yMDAwL0NQUy8wgYEGCCsGAQUFBwICMHUac0VsIHRpdHVsYXIgaGEgc2lkbyB2YWxpZG8gZW4gZm9ybWEgcHJlc2VuY2lhbCwgcXVlZGFuZG8gZWwgQ2VydGlmaWNhZG8gcGFyYSB1c28gdHJpYnV0YXJpbywgcGFnb3MsIGNvbWVyY2lvIHkgb3Ryb3MwCwYDVR0PBAQDAgTwMA0GCSqGSIb3DQEBBQUAA4GBABMfCyJF0mNXcov8iEWvjGFyyPTsXwvsYbbkOJ41wjaGOFMCInb4WY0ngM8BsDV22bGMs8oLyX7rVy16bGA8Z7WDUtYhoOM7mqXw/Hrpqjh3JgAf8zqdzBdH/q6mAbdvq/yb04JHKWPC7fMFuBoeyVWAnhmuMZfReWQiMUEHGGIW',
                    }
                },//FIN KEYINFO    
            }//FIN SIGNATURE
        }// FIN ENVIO DTE
    };

    const xml = builder.buildObject(xmlData);

    // Firmar el XML generado
    const signedXml = signXML(xml);

    // Guardamos el XML firmado en un archivo
    const filePath = './output/factura.xml';  // Ruta donde se guardará el archivo XML
    fs.writeFileSync(filePath, signedXml, 'utf8');

    console.log(`Archivo XML guardado en: ${filePath}`);

    return signedXml;
};

module.exports = buildAndSignXML;

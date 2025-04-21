const axios = require("axios");
const { io } = require('../api');
const { sendNotification } = require ("./notificationsController");


function generateRandomData() {
    const neto = Math.floor(Math.random() * 50000 + 10000);
    const iva = Math.floor(neto * 0.19);
    const total = neto + iva;
    return { neto, iva, total };
}
const IdMax = "";
/***********************************************************************************************/

const getBiiling = (req, res) => {
    const billingData = [
        { id: 1, name: 'Falabella Chile S.A.', documento: 305, tipo: "Factura Electronica", billitype: "FT", giro: "Tienda", neto: "418749", iva: "7951", total: "49800",address: "Av. Libertador Bernardo O'Higgins 1234, Santiago, Chile",femision: "2024-12-10",vencimiento: "2025-01-10",fepagos: "2025-01-10",terpagos: "",formaspago: "Efectivo",codinterno: "F1B2C3",ordencompra: "123",ordenventa: "",numeroenvio: "",rut: "76.123.456-7",comuna: "Santiago",ciudad: "Santiago",nrocliente: "CL123456",contacto: "",telefono: "+56 2 23456789",email: "contacto@falabella.cl",despachar: "",diredespacho: "",comunadestino: "",ciudaddespacho: "", son: "Cincuenta y seis mil pesos",estadoSII: "ING"},
        { id: 2, name: 'Cencosud Retail S.A.', documento: 452, tipo: "Factura Electronica", billitype: "FT", giro: "Tienda",  neto: "21946", iva: "4169", total: "26115",address: "Av. Vicuña Mackenna 1234, Santiago, Chile",femision: "2024-12-11",vencimiento: "2025-01-11",fepagos: "2025-01-11",terpagos: "",formaspago: "Crédito",codinterno: "C4D5E6",ordencompra: "124",ordenventa: "",numeroenvio: "",rut: "76.654.321-0",comuna: "Santiago",ciudad: "Santiago",nrocliente: "CL123457",contacto: "",telefono: "+56 2 87654321",email: "contacto@cencosud.cl",despachar: "",diredespacho: "",comunadestino: "",ciudaddespacho: "",son: "Cincuenta mil pesos", estadoSII: "ING" },
        { id: 3, name: 'Sodimac Chile S.A.', documento: 1005, tipo: "Factura Exenta", billitype: "FT", giro: "Construccion", neto: "56000", iva: "0", total: "56000",address: "Av. Manquehue 5678, Santiago, Chile",femision: "2024-12-12",vencimiento: "2025-01-12",fepagos: "2025-01-12",terpagos: "",formaspago: "Efectivo",codinterno: "S7D8F9",ordencompra: 125,ordenventa: "",numeroenvio: "",rut: "77.765.432-1",comuna: "Santiago",ciudad: "Santiago",nrocliente: "CL123458",contacto: "",telefono: "+56 2 34567890",email: "contacto@sodimac.cl",despachar: "",diredespacho: "",comunadestino: "",ciudaddespacho: "",son: "Cincuenta y seis mil pesos", estadoSII: "ING" },
        { id: 4, name: 'Sodimac Chile S.A.', documento: 262, tipo: "Factura Electronica", billitype: "FT", giro: "Construccion", neto: "35925", iva: "6825", total: "42750", address: "Av. Apoquindo 2234, Santiago, Chile",femision: "2024-12-15", vencimiento: "2025-01-15", fepagos: "2025-01-15",terpagos: "",formaspago: "Crédito",codinterno: "S2C3R4",ordencompra: 126,ordenventa: "",numeroenvio: "",rut: "77.876.543-2",comuna: "Santiago",ciudad: "Santiago",nrocliente: "CL123459",contacto: "",telefono: "+56 2 98765432",email: "contacto@sodimac.cl",despachar: "",diredespacho: "",comunadestino: "",ciudaddespacho: "",son: "Cincuenta y seis mil pesos", estadoSII: "ING" }, 
        { id: 5, name: 'Ripley Chile S.A.', documento: 159, tipo: "Factura Electronica", billitype: "FT", giro: "Tienda",  neto: "37698", iva: "7162", total: "44860",address: "Av. Presidente Riesco 7625, Santiago, Chile",femision: "2024-12-16",vencimiento: "2025-01-16",fepagos: "2025-01-16",terpagos: "",formaspago: "Efectivo",codinterno: "R4I5P6",ordencompra: 127,ordenventa: "",numeroenvio: "",rut: "76.234.567-8",comuna: "Santiago",ciudad: "Santiago",nrocliente: "CL123460",contacto: "",telefono: "+56 2 12345678",email: "contacto@ripley.cl",despachar: "",diredespacho: "",comunadestino: "",ciudaddespacho: "",son: "Cincuenta y seis mil pesos", estadoSII: "ING" },
        { id: 6, name: 'Jumbo Supermercados S.A.', documento: 356, tipo: "Factura Electronica", billitype: "FT", giro: "Supermercado",  neto: "37302", iva: "7087", total: "44389", address: "Av. Las Condes 14000, Santiago, Chile",femision: "2024-12-17",vencimiento: "2025-01-17",fepagos: "2025-01-17",terpagos: "",formaspago: "Crédito",codinterno: "J1M2B3",ordencompra: 128,ordenventa: "",numeroenvio: "",rut: "77.987.654-3",comuna: "Las Condes",ciudad: "Santiago",nrocliente: "CL123461",contacto: "",telefono: "+56 2 76543210",email: "contacto@jumbo.cl",despachar: "",diredespacho: "",comunadestino: "",ciudaddespacho: "",son: "Cincuenta y seis mil pesos", estadoSII: "ING" },
        { id: 7, name: 'La Polar S.A.', documento: 408, tipo: "Factura Electronica", billitype: "FT", giro: "Tienda",  neto: "33436", iva: "6352", total: "39788",address: "Av. Libertador Bernardo O'Higgins 3456, Santiago, Chile",femision: "2024-12-18",vencimiento: "2025-01-18",fepagos: "2025-01-18",terpagos: "",formaspago: "Efectivo",codinterno: "L4P5O6",ordencompra: 129,ordenventa: "",numeroenvio: "",rut: "76.543.210-9",comuna: "Santiago",ciudad: "Santiago",nrocliente: "CL123462",contacto: "",telefono: "+56 2 65432109",email: "contacto@lapolar.cl",despachar: "",diredespacho: "",comunadestino: "",ciudaddespacho: "",son: "Cincuenta y seis mil pesos", estadoSII: "ING" },
        { id: 8, name: 'Bci Corredores de Bolsa S.A.', documento: 237, tipo: "Factura Electronica", billitype: "FT", giro: "Banco",  neto: "44385", iva: "8433", total: "52818",address: "Av. Apoquindo 2000, Santiago, Chile",femision: "2024-12-19",vencimiento: "2025-01-19",fepagos: "2025-01-19",terpagos: "",formaspago: "Crédito",codinterno: "B7C8I9",ordencompra: 130,ordenventa: "",numeroenvio: "",rut: "76.321.765-4",comuna: "Las Condes",ciudad: "Santiago",nrocliente: "CL123463",contacto: "",telefono: "+56 2 34567891",email: "contacto@bci.cl",despachar: "",diredespacho: "",comunadestino: "",ciudaddespacho: "",son: "Cincuenta y seis mil pesos", estadoSII: "ING" },
        { id: 9, name: 'Banco de Chile S.A.', documento: 375, tipo: "Factura Electronica", billitype: "FT", giro: "Mall",  neto: "17247", iva: "3276", total: "20523", address: "Av. Vicuña Mackenna 1234, Santiago, Chile",femision: "2024-12-20",vencimiento: "2025-01-20",fepagos: "2025-01-20",terpagos: "",formaspago: "Efectivo",codinterno: "B3C4H5",ordencompra: 131,ordenventa: "",numeroenvio: "",rut: "76.432.654-6",comuna: "Santiago",ciudad: "Santiago",nrocliente: "CL123464",contacto: "",telefono: "+56 2 45678901",email: "contacto@bancodechile.cl",despachar: "",diredespacho: "",comunadestino: "",ciudaddespacho: "",son: "Cincuenta y seis mil pesos", estadoSII: "ING" },
        { id: 10, name: 'CMR Falabella S.A.', documento: 518, tipo: "Factura Electronica", billitype: "FT", giro: "Banco",  neto: "46592", iva: "8852", total: "55444",address: "Av. Bascuñán 1234, Santiago, Chile",femision: "2024-12-21",vencimiento: "2025-01-21",fepagos: "2025-01-21",terpagos: "",formaspago: "Crédito",codinterno: "V1T2R3",ordencompra: 132,ordenventa: "",numeroenvio: "",rut: "77.765.432-2",comuna: "Ñuñoa",ciudad: "Santiago",nrocliente: "CL123465",contacto: "",telefono: "+56 2 54321098",email: "contacto@vtr.cl",despachar: "",diredespacho: "",comunadestino: "",ciudaddespacho: "",son: "Cincuenta y seis mil pesos", estadoSII: "ING" },
        { id: 11, name: 'VTR Globalcom S.A.', documento: 392, tipo: "Factura Electronica", billitype: "FT", giro: "Comunicaciones",  neto: "59008", iva: "11211", total: "70219",address: "Av. El Golf 4321, Santiago, Chile",femision: "2024-12-22",vencimiento: "2025-01-22",fepagos: "2025-01-22",terpagos: "",formaspago: "Efectivo",codinterno: "E4N5T6",ordencompra: 133,ordenventa: "",numeroenvio: "",rut: "76.432.987-6",comuna: "Providencia",ciudad: "Santiago",nrocliente: "CL123466",contacto: "",telefono: "+56 2 23456765",email: "contacto@entel.cl",despachar: "",diredespacho: "",comunadestino: "",ciudaddespacho: "",son: "Cincuenta y seis mil pesos", estadoSII: "ING" },
        { id: 12, name: 'Entel S.A.', documento: 318, tipo: "Factura Electronica", billitype: "FT", giro: "Comunicaciones",  neto: "10205", iva: "1938", total: "12143",address: "Av. O'Higgins 2345, Santiago, Chile",femision: "2024-12-23",vencimiento: "2025-01-23",fepagos: "2025-01-23",terpagos: "",formaspago: "Crédito",codinterno: "B7E8S9",ordencompra: 134,ordenventa: "",numeroenvio: "",rut: "76.543.123-7",comuna: "Santiago",ciudad: "Santiago",nrocliente: "CL123467",contacto: "",telefono: "+56 2 87654321",email: "contacto@bancoestado.cl",despachar: "",diredespacho: "",comunadestino: "",ciudaddespacho: "",son: "Cincuenta y seis mil pesos", estadoSII: "ING" },
        { id: 13, name: 'Movistar Chile S.A.', documento: 360, tipo: "Factura Electronica", billitype: "FT", giro: "Comunicaciones",  neto: "18556", iva: "3525", total: "22081", address: "Av. Santa Rosa 1000, Santiago, Chile",femision: "2024-12-24",vencimiento: "2025-01-24",fepagos: "2025-01-24",terpagos: "",formaspago: "Efectivo",codinterno: "S1C2O3",ordencompra: 135,ordenventa: "",numeroenvio: "",rut: "76.987.654-3",comuna: "Macul",ciudad: "Santiago",nrocliente: "CL123468",contacto: "",telefono: "+56 2 98765432",email: "contacto@scotiabank.cl",despachar: "",diredespacho: "",comunadestino: "",ciudaddespacho: "",son: "Cincuenta y seis mil pesos", estadoSII: "ING" },
        { id: 14, name: 'Claro Chile S.A.', documento: 437, tipo: "Factura Electronica", billitype: "FT", giro: "Comunicaciones",  neto: "13795", iva: "2621", total: "16416",address: "Av. Príncipe de Gales 2000, Santiago, Chile",femision: "2024-12-25",vencimiento: "2025-01-25",fepagos: "2025-01-25",terpagos: "",formaspago: "Crédito",codinterno: "B2I3N4",ordencompra: 136,ordenventa: "",numeroenvio: "",rut: "76.543.987-0",comuna: "La Reina",ciudad: "Santiago",nrocliente: "CL123469",contacto: "",telefono: "+56 2 65432109",email: "contacto@bancointernacional.cl",despachar: "",diredespacho: "",comunadestino: "",ciudaddespacho: "",son: "Cincuenta y seis mil pesos", estadoSII: "ING" }, 
    ];
    
    res.json(billingData); // Devolver todos los datos para la tabla
};
/***********************************************************************************************/
function saveBilling(req, res){
    console.log('Datos recibidos:', req.body);
    const  facturas = req.body;
    console.log("asdadsadsadsadas"+facturas); 
    if(!facturas){
        return res.status(400).json({ message: 'Datos de facturacion son obligatorios.'});
    }
        return res.json({ message: 'Factura guardada correctamente', data: facturas });
}
/***********************************************************************************************/
const getBillingById = (req, res) => {
    const { id } = req.params; // Obtener el ID de la solicitud
    const billingData = [
        { id: 1, name: 'Falabella Chile S.A.', documento: 305, tipo: "Factura Electronica", billitype: "FT", giro: "Tienda", ...generateRandomData(),address: "Av. Libertador Bernardo O'Higgins 1234, Santiago, Chile",femision: "2024-12-10",vencimiento: "2025-01-10",fepagos: "2025-01-10",terpagos: "",formaspago: "Efectivo",codinterno: "F1B2C3",ordencompra: "123",ordenventa: "",numeroenvio: "",rut: "76.123.456-7",comuna: "Santiago",ciudad: "Santiago",nrocliente: "CL123456",contacto: "",telefono: "+56 2 23456789",email: "contacto@falabella.cl",despachar: "",diredespacho: "",comunadestino: "",ciudaddespacho: "", son: "Cincuenta y seis mil pesos", estadoSII: "ING"},
        { id: 2, name: 'Cencosud Retail S.A.', documento: 452, tipo: "Factura Electronica", billitype: "FT", giro: "Tienda", ...generateRandomData(),address: "Av. Vicuña Mackenna 1234, Santiago, Chile",femision: "2024-12-11",vencimiento: "2025-01-11",fepagos: "2025-01-11",terpagos: "",formaspago: "Crédito",codinterno: "C4D5E6",ordencompra: "124",ordenventa: "",numeroenvio: "",rut: "76.654.321-0",comuna: "Santiago",ciudad: "Santiago",nrocliente: "CL123457",contacto: "",telefono: "+56 2 87654321",email: "contacto@cencosud.cl",despachar: "",diredespacho: "",comunadestino: "",ciudaddespacho: "",son: "Cincuenta mil pesos", estadoSII: "ING" },
        { id: 3, name: 'Sodimac Chile S.A.', documento: 1005, tipo: "Factura Exenta", billitype: "FT", giro: "Construccion", neto: "56000", iva: "0", total: "56000",address: "Av. Manquehue 5678, Santiago, Chile",femision: "2024-12-12",vencimiento: "2025-01-12",fepagos: "2025-01-12",terpagos: "",formaspago: "Efectivo",codinterno: "S7D8F9",ordencompra: 125,ordenventa: "",numeroenvio: "",rut: "77.765.432-1",comuna: "Santiago",ciudad: "Santiago",nrocliente: "CL123458",contacto: "",telefono: "+56 2 34567890",email: "contacto@sodimac.cl",despachar: "",diredespacho: "",comunadestino: "",ciudaddespacho: "",son: "Cincuenta y seis mil pesos", estadoSII: "ING" },
        { id: 4, name: 'Sodimac Chile S.A.', documento: 262, tipo: "Factura Electronica", billitype: "FT", giro: "Construccion", ...generateRandomData(), address: "Av. Apoquindo 2234, Santiago, Chile",femision: "2024-12-15", vencimiento: "2025-01-15", fepagos: "2025-01-15",terpagos: "",formaspago: "Crédito",codinterno: "S2C3R4",ordencompra: 126,ordenventa: "",numeroenvio: "",rut: "77.876.543-2",comuna: "Santiago",ciudad: "Santiago",nrocliente: "CL123459",contacto: "",telefono: "+56 2 98765432",email: "contacto@sodimac.cl",despachar: "",diredespacho: "",comunadestino: "",ciudaddespacho: "",son: "Cincuenta y seis mil pesos", estadoSII: "ING" }, 
        { id: 5, name: 'Ripley Chile S.A.', documento: 159, tipo: "Factura Electronica", billitype: "FT", giro: "Tienda", ...generateRandomData(),address: "Av. Presidente Riesco 7625, Santiago, Chile",femision: "2024-10-16",vencimiento: "2025-01-16",fepagos: "2025-01-16",terpagos: "",formaspago: "Efectivo",codinterno: "R4I5P6",ordencompra: 127,ordenventa: "",numeroenvio: "",rut: "76.234.567-8",comuna: "Santiago",ciudad: "Santiago",nrocliente: "CL123460",contacto: "",telefono: "+56 2 12345678",email: "contacto@ripley.cl",despachar: "",diredespacho: "",comunadestino: "",ciudaddespacho: "",son: "Cincuenta y seis mil pesos", estadoSII: "ING" },
        { id: 6, name: 'Jumbo Supermercados S.A.', documento: 356, tipo: "Factura Electronica", billitype: "FT", giro: "Supermercado", ...generateRandomData(), address: "Av. Las Condes 14000, Santiago, Chile",femision: "2024-05-17",vencimiento: "2025-01-17",fepagos: "2025-01-17",terpagos: "",formaspago: "Crédito",codinterno: "J1M2B3",ordencompra: 128,ordenventa: "",numeroenvio: "",rut: "77.987.654-3",comuna: "Las Condes",ciudad: "Santiago",nrocliente: "CL123461",contacto: "",telefono: "+56 2 76543210",email: "contacto@jumbo.cl",despachar: "",diredespacho: "",comunadestino: "",ciudaddespacho: "",son: "Cincuenta y seis mil pesos", estadoSII: "ING" },
        { id: 7, name: 'La Polar S.A.', documento: 408, tipo: "Factura Electronica", billitype: "FT", giro: "Tienda", ...generateRandomData(),address: "Av. Libertador Bernardo O'Higgins 3456, Santiago, Chile",femision: "2024-12-18",vencimiento: "2025-01-18",fepagos: "2025-01-18",terpagos: "",formaspago: "Efectivo",codinterno: "L4P5O6",ordencompra: 129,ordenventa: "",numeroenvio: "",rut: "76.543.210-9",comuna: "Santiago",ciudad: "Santiago",nrocliente: "CL123462",contacto: "",telefono: "+56 2 65432109",email: "contacto@lapolar.cl",despachar: "",diredespacho: "",comunadestino: "",ciudaddespacho: "",son: "Cincuenta y seis mil pesos", estadoSII: "ING" },
        { id: 8, name: 'Bci Corredores de Bolsa S.A.', documento: 237, tipo: "Factura Electronica", billitype: "FT", giro: "Banco", ...generateRandomData(),address: "Av. Apoquindo 2000, Santiago, Chile",femision: "2024-12-19",vencimiento: "2025-01-19",fepagos: "2025-01-19",terpagos: "",formaspago: "Crédito",codinterno: "B7C8I9",ordencompra: 130,ordenventa: "",numeroenvio: "",rut: "76.321.765-4",comuna: "Las Condes",ciudad: "Santiago",nrocliente: "CL123463",contacto: "",telefono: "+56 2 34567891",email: "contacto@bci.cl",despachar: "",diredespacho: "",comunadestino: "",ciudaddespacho: "",son: "Cincuenta y seis mil pesos", estadoSII: "ING" },
        { id: 9, name: 'Banco de Chile S.A.', documento: 375, tipo: "Factura Electronica", billitype: "FT", giro: "Mall", ...generateRandomData(), address: "Av. Vicuña Mackenna 1234, Santiago, Chile",femision: "2024-10-20",vencimiento: "2025-01-20",fepagos: "2025-01-20",terpagos: "",formaspago: "Efectivo",codinterno: "B3C4H5",ordencompra: 131,ordenventa: "",numeroenvio: "",rut: "76.432.654-6",comuna: "Santiago",ciudad: "Santiago",nrocliente: "CL123464",contacto: "",telefono: "+56 2 45678901",email: "contacto@bancodechile.cl",despachar: "",diredespacho: "",comunadestino: "",ciudaddespacho: "",son: "Cincuenta y seis mil pesos", estadoSII: "ING" },
        { id: 10, name: 'CMR Falabella S.A.', documento: 518, tipo: "Factura Electronica", billitype: "FT", giro: "Banco", ...generateRandomData(),address: "Av. Bascuñán 1234, Santiago, Chile",femision: "2024-12-21",vencimiento: "2025-01-21",fepagos: "2025-01-21",terpagos: "",formaspago: "Crédito",codinterno: "V1T2R3",ordencompra: 132,ordenventa: "",numeroenvio: "",rut: "77.765.432-2",comuna: "Ñuñoa",ciudad: "Santiago",nrocliente: "CL123465",contacto: "",telefono: "+56 2 54321098",email: "contacto@vtr.cl",despachar: "",diredespacho: "",comunadestino: "",ciudaddespacho: "",son: "Cincuenta y seis mil pesos", estadoSII: "ING" },
        { id: 11, name: 'VTR Globalcom S.A.', documento: 392, tipo: "Factura Electronica", billitype: "FT", giro: "Comunicaciones", ...generateRandomData(),address: "Av. El Golf 4321, Santiago, Chile",femision: "2024-12-22",vencimiento: "2025-01-22",fepagos: "2025-01-22",terpagos: "",formaspago: "Efectivo",codinterno: "E4N5T6",ordencompra: 133,ordenventa: "",numeroenvio: "",rut: "76.432.987-6",comuna: "Providencia",ciudad: "Santiago",nrocliente: "CL123466",contacto: "",telefono: "+56 2 23456765",email: "contacto@entel.cl",despachar: "",diredespacho: "",comunadestino: "",ciudaddespacho: "",son: "Cincuenta y seis mil pesos", estadoSII: "ING" },
        { id: 12, name: 'Entel S.A.', documento: 318, tipo: "Factura Electronica", billitype: "FT", giro: "Comunicaciones", ...generateRandomData(),address: "Av. O'Higgins 2345, Santiago, Chile",femision: "2024-11-23",vencimiento: "2025-01-23",fepagos: "2025-01-23",terpagos: "",formaspago: "Crédito",codinterno: "B7E8S9",ordencompra: 134,ordenventa: "",numeroenvio: "",rut: "76.543.123-7",comuna: "Santiago",ciudad: "Santiago",nrocliente: "CL123467",contacto: "",telefono: "+56 2 87654321",email: "contacto@bancoestado.cl",despachar: "",diredespacho: "",comunadestino: "",ciudaddespacho: "",son: "Cincuenta y seis mil pesos", estadoSII: "ING" },
        { id: 13, name: 'Movistar Chile S.A.', documento: 360, tipo: "Factura Electronica", billitype: "FT", giro: "Comunicaciones", ...generateRandomData(), address: "Av. Santa Rosa 1000, Santiago, Chile",femision: "2024-12-24",vencimiento: "2025-01-24",fepagos: "2025-01-24",terpagos: "",formaspago: "Efectivo",codinterno: "S1C2O3",ordencompra: 135,ordenventa: "",numeroenvio: "",rut: "76.987.654-3",comuna: "Macul",ciudad: "Santiago",nrocliente: "CL123468",contacto: "",telefono: "+56 2 98765432",email: "contacto@scotiabank.cl",despachar: "",diredespacho: "",comunadestino: "",ciudaddespacho: "",son: "Cincuenta y seis mil pesos", estadoSII: "ING" },
        { id: 14, name: 'Claro Chile S.A.', documento: 437, tipo: "Factura Electronica", billitype: "FT", giro: "Comunicaciones", ...generateRandomData(),address: "Av. Príncipe de Gales 2000, Santiago, Chile",femision: "2024-11-25",vencimiento: "2025-01-25",fepagos: "2025-01-25",terpagos: "",formaspago: "Crédito",codinterno: "B2I3N4",ordencompra: 136,ordenventa: "",numeroenvio: "",rut: "76.543.987-0",comuna: "La Reina",ciudad: "Santiago",nrocliente: "CL123469",contacto: "",telefono: "+56 2 65432109",email: "contacto@bancointernacional.cl",despachar: "",diredespacho: "",comunadestino: "",ciudaddespacho: "",son: "Cincuenta y seis mil pesos", estadoSII: "ING" }, 
    ];    


    // Buscar la factura por id
    const selectedBilling = billingData.find(item => item.id === parseInt(id));

    if (selectedBilling) {
        res.json(selectedBilling); // Si se encuentra la factura, devolver los datos
    } else {
        res.status(404).json({ error: 'Factura no encontrada' }); // Si no se encuentra la factura
    }
}
/************************************************************************************************/

const getClient = (req, res) =>{
    res.json([
        { 
            id: 1, 
            name: "Rodrigo Hernandez Vidal", 
            rut: "11.111.111-1", 
            email: "rodrigo.hernandez@lbo.cl",
            address:"Las Dedaleras 3622",
            commune: "Puente Alto", 
            phone: "+56966625520", 
            giro: "Informatica", 
            ciudad: "San Javier", 
            contacto:"Rodrigo Hernandez Vidal", 
            firmante:"S", 
            isEmpresa: "N", 
            idEmpRel: "N",
            
        },
        { 
            id: 2, 
            name: "LBO Abogados", 
            rut:"77.777.777-7", 
            email: "lbo@lbo.cl", 
            address:"Avenida Andres Bello 2777 Of.1001",
            commune: "Las Condes",
            phone: "+222781580", 
            giro: "Asesorías Legales", 
            ciudad: "Santiago", 
            contacto:"Felipe Saldias", 
            firmante: "N",
            isEmpresa: "S", 
            idEmpRel: "S" 
        },
        { 
            id: 3, 
            name: "ROLIMAFA", 
            rut:"33.333.333-3", 
            email: "rolimafa@rolimafa.cl", 
            address:"Av.La Florida 6658",
            commune: "La Florida",
            phone: "+222722222", 
            giro: "Venta de Articulos Informaticos", 
            ciudad: "Santiago", 
            contacto:"Fabiola Osea", 
            firmante: "N", 
            isEmpresa: "S" , 
            idEmpRel: "S" 
        },
    ]);
}

/***********************************************************************************************/

const getTipoDocBilling = (req, res) => {
    res.json([
        { id:1, name: "Factura Electronica", tipo: "FT" },
        { id:2, name: "Factura Electronica Exenta", tipo: "FV"},
        { id:3, name: "Boleta Electronica", tipo: "BE"}
    ]);
}
/***********************************************************************************************/
const getFirmaRelacion = (req, res) =>{
    const { id } = req.params; 
    const firmanteData = ([
        { id: 1, name: "Felipe Saldias", rut: "22.222.222-2", email: "felipe.saldias@lbo.cl", firmante: "S", isEmpresa: "N", idEmpRel: 2 },
        { id: 2, name: "Fabiola Osea", rut: "44.444.444-4", email: "fabiolaosea@rolimafa.cl", firmante: "S", isEmpresa: "N", idEmpRel: 3 },
    ]);

    const selectedFirmante = firmanteData.find(item => item.idEmpRel === parseInt(id));

    if (selectedFirmante) {
        res.json(selectedFirmante); // Si se encuentra firmante, devolver los datos
    } 
}
/***********************************************************************************************/
const getFirmantes = (req, res) =>{
    res.json([
        { id:1, name: "Rodrigo Hernandez Vidal", rut: "11.111.111-1", email: "rodrigo.hernandez@lbo.cl", firmante:"S", isEmpresa: "N", idEmpRel: "N" },
        { id:2, name: "Felipe Saldias", rut:"22.222.222-2", email: "felipe.saldias@lbo.cl", firmante: "S", isEmpresa: "N", idEmpRel: "N" },
        { id:3, name: "Fabiola Osea", rut:"44.444.444-4", email: "fabiolaosea@foog.cl", firmante: "S", isEmpresa: "N", idEmpRel: "N" },
        { id:4, name: "Barbara Hernandez", rut:"55.555.555-5", email: "barbara.hernandez@lbo.cl", firmante: "S", isEmpresa: "N", idEmpRel: "N" },
        { id:5, name: "Almendra Negrete", rut:"66.666.666-6", email: "almendra.negrete@lbo.cl", firmante: "S", isEmpresa: "N", idEmpRel: "N" },
        { id:6, name: "Sofia Jimenez", rut:"88.888.888-8", email: "sofia.jimenez@lbo.cl", firmante: "S", isEmpresa: "N", idEmpRel: "N" },
    ]);
}
/***********************************************************************************************/
const getCiudades = (req, res) =>{
    res.json([
            { id: 1, nombre: "Santiago", region: "Metropolitana" },
            { id: 6, nombre: "Valparaíso", region: "Valparaíso"  },
            { id: 7, nombre: "Viña del Mar", region: "Valparaíso" },
            { id: 8, nombre: "Quillota", region: "Valparaíso" },
            { id: 9, nombre: "San Antonio", region: "Valparaíso" },
            { id: 10, nombre: "Los Andes", region: "Valparaíso" },
            { id: 11, nombre: "Concepción",region: "Biobío" },
            { id: 14, nombre: "Hualpén", region: "Biobío" },
            { id: 15, nombre: "San Pedro de la Paz", region: "Biobío" },
            { id: 16, nombre: "La Serena", region: "Coquimbo" },
            { id: 17, nombre: "Coquimbo", region: "Coquimbo" },
            { id: 18, nombre: "Ovalle", region: "Coquimbo" },
            { id: 19, nombre: "Illapel", region: "Coquimbo" },
            { id: 20, nombre: "Andacollo", region: "Coquimbo" },
            { id: 21, nombre: "Antofagasta", region: "Antofagasta" },
            { id: 22, nombre: "Calama", region: "Antofagasta" },
            { id: 23, nombre: "Tocopilla", region: "Antofagasta" },
            { id: 24, nombre: "Mejillones", region: "Antofagasta" },
            { id: 25, nombre: "San Pedro de Atacama", region: "Antofagasta" },
            { id: 26, nombre: "Temuco", region: "La Araucanía" },
            { id: 27, nombre: "Angol", region: "La Araucanía" },
            { id: 28, nombre: "Villarrica", region: "La Araucanía" },
            { id: 29, nombre: "Pucón", region: "La Araucanía" },
            { id: 30, nombre: "Cañete", region: "La Araucanía" },
            { id: 31, nombre: "Punta Arenas", region: "Magallanes" },
            { id: 32, nombre: "Puerto Natales", region: "Magallanes" },
            { id: 33, nombre: "Porvenir", region: "Magallanes" },
            { id: 34, nombre: "Puerto Williams", region: "Magallanes" },
            { id: 35, nombre: "Cabo de Hornos", region: "Magallanes" },
            { id: 36, nombre: "Iquique",region: "Tarapacá" },
            { id: 37, nombre: "Alto Hospicio", region: "Tarapacá" },
            { id: 38, nombre: "Pozo Almonte", region: "Tarapacá" },
            { id: 39, nombre: "Camiña", region: "Tarapacá" },
            { id: 40, nombre: "Colchane", region: "Tarapacá" },
            { id: 41, nombre: "Rancagua", region: "Libertador General Bernardo O'Higgins" },
            { id: 42, nombre: "Machalí", region: "Libertador General Bernardo O'Higgins" },
            { id: 43, nombre: "San Fernando", region: "Libertador General Bernardo O'Higgins" },
            { id: 44, nombre: "Pichidegua", region: "Libertador General Bernardo O'Higgins" },
            { id: 45, nombre: "Mostazal", region: "Libertador General Bernardo O'Higgins" },
            { id: 46, nombre: "Arica", region: "Arica y Parinacota" },
            { id: 47, nombre: "Camarones", region: "Arica y Parinacota" },
            { id: 48, nombre: "Putre", region: "Arica y Parinacota" },
            { id: 49, nombre: "General Lagos", region: "Arica y Parinacota" },
            { id: 50, nombre: "Salar de Surire", region: "Arica y Parinacota" },
            { id: 51, nombre: "Osorno", region: "Los Lagos" },
            { id: 52, nombre: "Puerto Montt", region: "Los Lagos" },
            { id: 53, nombre: "Puerto Varas", region: "Los Lagos" },
            { id: 54, nombre: "Castro", region: "Los Lagos" },
            { id: 55, nombre: "Frutillar", region: "Los Lagos" },
            { id: 56, nombre: "Chillán", region: "Ñuble"},
            { id: 57, nombre: "Los Ángeles", region: "Ñuble" },
            { id: 58, nombre: "San Carlos", region: "Ñuble" },
            { id: 59, nombre: "Coihueco", region: "Ñuble" },
            { id: 60, nombre: "Yungay", region: "Ñuble" },
            { id: 61, nombre: "Valdivia", region: "Los Ríos" },
            { id: 62, nombre: "La Unión", region: "Los Ríos" },
            { id: 63, nombre: "Río Bueno", region: "Los Ríos" },
            { id: 64, nombre: "Paillaco", region: "Los Ríos" },
            { id: 65, nombre: "Lago Ranco", region: "Los Ríos" },
            { id: 66, nombre: "Talca", region: "Maule" },
            { id: 67, nombre: "Curicó", region: "Maule" },
            { id: 68, nombre: " Linares", region: "Maule" },
            { id: 69, nombre: "San Clemente", region: "Maule" },
            { id: 70, nombre: "Constitución", region: "Maule" },
            { id: 71, nombre: "San Javier", region: "Maule"},
            { id: 72, nombre: "Copiapo", region: "Atacama"}
           
        ]);
}
/***********************************************************************************************/
const getComunas = (req, res) =>{
    res.json([
            { id: 1,  nombre: "Santiago", region: "Metropolitana" },
            { id: 2,  nombre: "Maipú", region: "Metropolitana" },
            { id: 3,  nombre: "Providencia", region: "Metropolitana" },
            { id: 4,  nombre: "Las Condes", region: "Metropolitana" },
            { id: 5,  nombre: "La Florida", region: "Metropolitana" },
            { id: 6,  nombre: "La Reina", region: "Metropolitana" },
            { id: 7,  nombre: "Vitacura", region: "Metropolitana" },
            { id: 8,  nombre: "Puente Alto", region: "Metropolitana" },
            { id: 9,  nombre: "Ñuñoa", region: "Metropolitana" },
            { id: 10, nombre: "El Bosque", region: "Metropolitana" },
            { id: 11, nombre: "Arica", region: "Arica y Parinacota" },
            { id: 12, nombre: "Camarones", region: "Arica y Parinacota" },
            { id: 13, nombre: "Putre", region: "Arica y Parinacota" },
            { id: 14, nombre: "General Lagos", region: "Arica y Parinacota" },
            { id: 15, nombre: "Alto Hospicio", region: "Tarapacá" },
            { id: 16, nombre: "Iquique", region: "Tarapacá" },
            { id: 17, nombre: "Pica", region: "Tarapacá" },
            { id: 18, nombre: "Pozo Almonte", region: "Tarapacá" },
            { id: 19, nombre: "Camiña", region: "Tarapacá" },
            { id: 20, nombre: "Antofagasta", region: "Antofagasta" },
            { id: 21, nombre: "Mejillones", region: "Antofagasta" },
            { id: 22, nombre: "Sierra Gorda", region: "Antofagasta" },
            { id: 23, nombre: "Taltal", region: "Antofagasta" },
            { id: 24, nombre: "Calama", region: "Antofagasta" },
            { id: 25, nombre: "Copiapó", region: "Atacama" },
            { id: 26, nombre: "Caldera", region: "Atacama" },
            { id: 27, nombre: "Tierra Amarilla", region: "Atacama" },
            { id: 28, nombre: "Chañaral", region: "Atacama" },
            { id: 29, nombre: "Vallenar", region: "Atacama" },
            { id: 30, nombre: "La Serena", region: "Coquimbo" },
            { id: 31, nombre: "Coquimbo", region: "Coquimbo" },
            { id: 32, nombre: "Andacollo", region: "Coquimbo" },
            { id: 33, nombre: "Ovalle", region: "Coquimbo" },
            { id: 34, nombre: "Illapel", region: "Coquimbo" },
            { id: 35, nombre: "Valparaíso", region: "Valparaíso" },
            { id: 36, nombre: "Viña del Mar", region: "Valparaíso" },
            { id: 37, nombre: "Concón", region: "Valparaíso" },
            { id: 38, nombre: "Quillota", region: "Valparaíso" },
            { id: 39, nombre: "San Antonio", region: "Valparaíso" },
            { id: 40, nombre: "Rancagua", region: "Libertador General Bernardo O'Higgins" },
            { id: 41, nombre: "Machalí", region: "Libertador General Bernardo O'Higgins" },
            { id: 42, nombre: "San Fernando", region: "Libertador General Bernardo O'Higgins" },
            { id: 43, nombre: "Rengo", region: "Libertador General Bernardo O'Higgins" },
            { id: 44, nombre: "Pichilemu", region: "Libertador General Bernardo O'Higgins" },
            { id: 45, nombre: "Talca", region: "Maule" },
            { id: 46, nombre: "Curicó", region: "Maule" },
            { id: 47, nombre: "Linares", region: "Maule" },
            { id: 48, nombre: "San Javier", region: "Maule" },
            { id: 49, nombre: "Constitución", region: "Maule" },
            { id: 50, nombre: "Chillán", region: "Ñuble" },
            { id: 51, nombre: "Ñiquén", region: "Ñuble" },
            { id: 52, nombre: "Cobquecura", region: "Ñuble" },
            { id: 53, nombre: "Pemuco", region: "Ñuble" },
            { id: 54, nombre: "San Carlos", region: "Ñuble" },
            { id: 55, nombre: "Concepción", region: "Biobío" },
            { id: 56, nombre: "Coronel", region: "Biobío" },
            { id: 57, nombre: "Talcahuano", region: "Biobío" },
            { id: 58, nombre: "Hualpén", region: "Biobío" },
            { id: 59, nombre: "Los Ángeles", region: "Biobío" },
            { id: 60, nombre: "Temuco", region: "La Araucanía" },
            { id: 61, nombre: "Villarrica", region: "La Araucanía" },
            { id: 62, nombre: "Pucón", region: "La Araucanía" },
            { id: 63, nombre: "Cautín", region: "Araucanía" },
            { id: 64, nombre: "Angol", region: "La Araucanía" },
            { id: 65, nombre: "Valdivia", region: "Los Ríos" },
            { id: 66, nombre: "La Unión", region: "Los Ríos" },
            { id: 67, nombre: "Río Bueno", region: "Los Ríos" },
            { id: 68, nombre: "Mariquina", region: "Los Ríos" },
            { id: 69, nombre: "Los Lagos", region: "Los Lagos" },
            { id: 70, nombre: "Osorno", region: "Los Lagos" },
            { id: 71, nombre: "Puerto Montt", region: "Los Lagos" },
            { id: 72, nombre: "Puerto Varas", region: "Los Lagos" },
            { id: 73, nombre: "Ancud", region: "Los Lagos" },
            { id: 74, nombre: "Aysén", region: "Aysén" },
            { id: 75, nombre: "Cochrane", region: "Aysén" },
            { id: 76, nombre: "Chile Chico", region: "Aysén" },
            { id: 77, nombre: "Cisnes",region: "Aysén" },
            { id: 78, nombre: "Rio Ibáñez",region: "Aysén" },
            { id: 79, nombre: "Punta Arenas", region: "Magallanes" },
            { id: 80, nombre: "Puerto Natales",region: "Magallanes" },
            { id: 81, nombre: "Porvenir", region: "Magallanes" },
            { id: 82, nombre: "Cabo de Hornos", region: "Magallanes" },
            { id: 83, nombre: "Primavera", region: "Magallanes" }
    ])}

module.exports = {
    getBiiling,
    getClient,
    getTipoDocBilling,
    getBillingById,
    getCiudades,
    getComunas,
    saveBilling,
    getFirmaRelacion,
    getFirmantes

}
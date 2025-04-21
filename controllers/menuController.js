// menuController.js

// Lógica para obtener los elementos del menú
exports.getMenuItems = (req, res) => {
    const { userEmpresa } = req.params; // Obtener userEmpresa de los parámetros de la URL
    console.log(userEmpresa);
  
    let menuItems;
  
    if (userEmpresa === 'S') {
        menuItems = [
            { icon: 'HomeIcon', command: 'handleHome' },
            {
                label: 'Facturación',
                icon: 'ReceiptIcon',
                submenu: [
                    { label: 'Generación Factura', onClick: 'handleBillingClickBilling' },
                    { label: 'Clientes', onClick: 'handleBillingClickClient' },
                ],
            },
            {
                label: 'Inventarios',
                icon: 'InventoryIcon',
                submenu: [
                    { label: 'Gestion Inventario', onClick: 'handleBillingClickIncome' },
                    { label: 'Depreciación', onClick: 'handleBillingClick' },
                ],
            },
            { 
                label: 'Contabilidad', 
                icon: 'AssuredWorkloadIcon', 
                submenu: [
                    { label: 'Gestion Compras', onClick: 'handlePurchasesClick' },
                    { label: 'Proveedores', onClick: 'handleProvidersClick' },
                    { label: 'Ordenes de Compra', onClick: 'handleBillingClick' ,
                      submenu: [
                          { label: 'Cotizador', onClick: 'handleOrderCotizador' },
                          { label: 'Generar', onClick: 'handleOrderCotizador' },
                          { label: 'Enviar', onClick: 'handleOrderCotizador' },
                      ]
                    },
                    { label: 'Rendiciones', onClick: 'handleSurrenderClick' },
                    { label: 'Centro de costos', onClick: 'handleCostCenterClick' },
                    { label: 'Plan de cuentas', onClick: 'handleAccountPlanClick' },
                ],
            },
            {
                label: 'Documentacion', 
                icon: 'DescriptionIcon', 
                submenu: [
                    { label: 'Gestion Documental', onClick: 'handleBillingClickIncome' },
                    { label: 'Subir Documentos', onClick: 'handleAdvancedSignatureClick' },
                    { label: 'Firmar Documentos', onClick: 'handleSignatureClick' },
                    { label: 'Visacion de documentos', onClick: 'handleBillingClick'  ,
                      submenu: [
                          { label: 'VºBº Administracion', onClick: 'handleOrderCotizador' },
                          { label: 'VºBº Gerencia', onClick: 'handleOrderCotizador' },
                      ]
                    },
                ],
            },
            { label: 'RR.HH', icon: 'Diversity3Icon', submenu: [
                { label: 'Empleados', onClick: 'handleBillingClickIncome' },
                { label: 'Solicitudes', onClick: 'handleBillingClickIncome' },
                { label: 'Vacaciones', onClick: 'handleBillingClick' },
            ]},
            { label: 'Reportes', icon: 'AssessmentIcon', link: '#' },
            { label: 'Soporte', icon: 'SettingsIcon', submenu: [
                { label: 'Solicitudes', onClick: 'handleBillingClickIncome' },
                { label: 'Configuraciones', onClick: 'handleBillingClick' },
            ]},
            {
                label: 'Perfil',
                icon: 'AccountBoxIcon',
                submenu: [
                    { label: 'Perfil', onClick: 'handleClickProfile' },
                    { label: 'Bitacora', onClick: 'handleBillingClick' },
                    { label: 'Contraseña', onClick: 'handleBillingClick' },
                ],
            },
            { icon: 'LogoutIcon', command: 'handleLogout' },
        ];
    } else {
        menuItems = [
            { icon: 'LogoutIcon', command: 'handleLogout' },
        ];
    }
  
    res.json(menuItems); // Devuelve los elementos del menú como respuesta
  };
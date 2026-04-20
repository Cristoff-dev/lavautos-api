import express from "express";
import ControllerInventory from "./inventory.controller.js";
import middlewares from "./inventory.middleware.js";
import validationToken from '../../shared/middlewares/validate.token.middleware.js';
import authorization from '../../shared/middlewares/authorization.middleware.js';

const router = express.Router();
const controller = new ControllerInventory();

// Todas las rutas requieren token
router.use(validationToken);

// ============================================
// RUTAS PÚBLICAS (Todos los roles autenticados)
// ============================================
router.get('/', 
    authorization(['ADMIN', 'SUPERVISOR', 'CAJERO']), 
    controller.getInsumos
);

router.get('/dropdown', 
    authorization(['ADMIN', 'SUPERVISOR', 'CAJERO']), 
    controller.getInsumosDropdown
);

router.get('/alerts/low-stock', 
    authorization(['ADMIN', 'SUPERVISOR', 'CAJERO']), 
    controller.getLowStockInsumos
);

router.get('/resumen', 
    authorization(['ADMIN', 'SUPERVISOR']), 
    controller.getResumenInventario
);

router.get('/:id', 
    authorization(['ADMIN', 'SUPERVISOR', 'CAJERO']), 
    middlewares.validateIdParam,
    controller.getInsumoById
);

router.get('/:id/historial', 
    authorization(['ADMIN', 'SUPERVISOR']), 
    middlewares.validateIdParam,
    controller.getHistorialInsumo
);

// ============================================
// RUTAS PROTEGIDAS (Solo ADMIN y SUPERVISOR)
// ============================================
router.post('/', 
    authorization(['ADMIN', 'SUPERVISOR']), 
    middlewares.validateAddInsumo,
    controller.addInsumo
);

router.patch('/:id', 
    authorization(['ADMIN', 'SUPERVISOR']), 
    middlewares.validateUpdateInsumo,
    controller.updateInsumo
);

router.patch('/stock/:id', 
    authorization(['ADMIN', 'SUPERVISOR']), 
    middlewares.validateUpdateStock,
    controller.updateStock
);

router.get('/reportes/pdf', 
    authorization(['ADMIN', 'SUPERVISOR']), 
    controller.generateReportPdf
);

// ============================================
// RUTAS DE ADMINISTRACIÓN (Solo ADMIN)
// ============================================
router.delete('/:id', 
    authorization(['ADMIN']), 
    middlewares.validateIdParam,
    controller.deleteInsumo
);

router.patch('/restore/:id', 
    authorization(['ADMIN']), 
    middlewares.validateIdParam,
    controller.restoreInsumo
);

export default router;
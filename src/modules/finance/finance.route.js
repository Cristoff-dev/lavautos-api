import express from "express";
import ControllerFinance from "./finance.controller.js";
import financeMiddleware from "./finance.middleware.js";
import validationToken from '../../shared/middlewares/validate.token.middleware.js';
import authorization from '../../shared/middlewares/authorization.middleware.js';

const router = express.Router();
const controller = new ControllerFinance();

// Todas las rutas requieren token
router.use(validationToken);

// ============================================
// RUTAS PÚBLICAS (Todos los roles autenticados)
// ============================================
router.get('/balance',
    authorization(['ADMIN', 'SUPERVISOR', 'CAJERO']),
    controller.getBalance
);

router.get('/history',
    authorization(['ADMIN', 'SUPERVISOR', 'CAJERO']),
    controller.getHistory
);

router.get('/resumen',
    authorization(['ADMIN', 'SUPERVISOR']),
    controller.getResumenFinanciero
);

router.get('/historial',
    authorization(['ADMIN', 'SUPERVISOR']),
    controller.getHistorialTransacciones
);

router.get('/balance-periodo',
    authorization(['ADMIN', 'SUPERVISOR']),
    controller.calcularBalancePorPeriodo
);

router.get('/dropdown',
    authorization(['ADMIN', 'SUPERVISOR', 'CAJERO']),
    controller.getTransaccionesDropdown
);

router.get('/:id',
    authorization(['ADMIN', 'SUPERVISOR', 'CAJERO']),
    financeMiddleware.validateIdParam,
    controller.getTransactionById
);

// ============================================
// RUTAS PROTEGIDAS (Solo ADMIN y SUPERVISOR)
// ============================================
router.post('/transactions',
    authorization(['ADMIN', 'SUPERVISOR']),
    financeMiddleware.validarTransaccion,
    controller.createTransaction
);

router.put('/:id',
    authorization(['ADMIN', 'SUPERVISOR']),
    financeMiddleware.validateIdParam,
    financeMiddleware.validarTransaccion,
    controller.updateTransaction
);

router.delete('/:id',
    authorization(['ADMIN', 'SUPERVISOR']),
    financeMiddleware.validateIdParam,
    controller.deleteTransaction
);

export default router;
import express from 'express';
import {
    obtenerProveedores,
    obtenerProveedoresDropdown,
    obtenerProveedor,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor,
    restaurarProveedor,
    obtenerProductosAsignados,
    exportarReporteProveedores
} from './providers.controller.js';
import { validarCrearProveedor, validarActualizarProveedor, validarIdParam } from './providers.middleware.js';
import validationToken from '../../shared/middlewares/validate.token.middleware.js';
import authorization from '../../shared/middlewares/authorization.middleware.js';

const router = express.Router();

router.use(validationToken);

// Endpoints de consulta general
router.get('/', authorization(['ADMIN', 'SUPERVISOR', 'CAJERO']), obtenerProveedores);
router.get('/dropdown', authorization(['ADMIN', 'SUPERVISOR', 'CAJERO']), obtenerProveedoresDropdown);
router.get('/:id', authorization(['ADMIN', 'SUPERVISOR', 'CAJERO']), validarIdParam, obtenerProveedor);
router.get('/:id/productos', authorization(['ADMIN', 'SUPERVISOR', 'CAJERO']), validarIdParam, obtenerProductosAsignados);

// Endpoints de edición y reportería
router.get('/reportes/pdf', authorization(['ADMIN', 'SUPERVISOR']), exportarReporteProveedores);
router.post('/', authorization(['ADMIN', 'SUPERVISOR']), validarCrearProveedor, crearProveedor);
router.put('/:id', authorization(['ADMIN', 'SUPERVISOR']), validarIdParam, validarActualizarProveedor, actualizarProveedor);

// Administración estricta de estados lógicos
router.delete('/:id', authorization(['ADMIN']), validarIdParam, eliminarProveedor);
router.patch('/restore/:id', authorization(['ADMIN']), validarIdParam, restaurarProveedor);

export default router;
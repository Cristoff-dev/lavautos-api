import express from 'express';
import {
    obtenerTipoVehiculos,
    obtenerTipoVehiculo,
    crearTipoVehiculo,
    actualizarTipoVehiculo,
    desactivarTipoVehiculo,
    reactivarTipoVehiculo,
    exportarReporteTipoVehiculo
} from './type_vehicles.controller.js';
import { validarTipoVehiculo } from './type_vehicles.middleware.js';

const router = express.Router();

// Rutas CRUD para Tipo Vehículos
router.get('/', obtenerTipoVehiculos);
router.get('/reportes/pdf', exportarReporteTipoVehiculo);
router.get('/:id', obtenerTipoVehiculo);
router.post('/', validarTipoVehiculo, crearTipoVehiculo);
router.put('/:id', validarTipoVehiculo, actualizarTipoVehiculo);
router.patch('/desactivar/:id', desactivarTipoVehiculo);
router.patch('/reactivar/:id', reactivarTipoVehiculo);

export default router;
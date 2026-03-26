import express from 'express';
import {
    obtenerProveedores,
    obtenerProveedor,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor
} from './providers.controller.js';
import { validarCrearProveedor, validarActualizarProveedor } from './providers.middleware.js';

const router = express.Router();

router.get('/', obtenerProveedores);
router.get('/:id', obtenerProveedor);
router.post('/', validarCrearProveedor, crearProveedor);
router.put('/:id', validarActualizarProveedor, actualizarProveedor);
router.delete('/:id', eliminarProveedor);

export default router;
import express from 'express';
import {
    obtenerProveedores,
    obtenerProveedor,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor
} from './providers.controller.js';
import { validarProveedor } from './providers.middleware.js';

const router = express.Router();

router.get('/', obtenerProveedores);
router.get('/:id', obtenerProveedor);
router.post('/', validarProveedor, crearProveedor);
router.put('/:id', validarProveedor, actualizarProveedor);
router.delete('/:id', eliminarProveedor);

export default router;
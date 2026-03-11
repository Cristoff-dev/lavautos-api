import express from 'express';
import {
    obtenerProveedores,
    obtenerProveedor,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor
} from './providers.controller.js';

const router = express.Router();

router.get('/', obtenerProveedores);
router.get('/:id', obtenerProveedor);
router.post('/', crearProveedor);
router.put('/:id', actualizarProveedor);
router.delete('/:id', eliminarProveedor);

export default router;
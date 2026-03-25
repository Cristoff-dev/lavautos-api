import express from 'express';
import {
    obtenerServicios,
    obtenerServicio,
    crearServicio,
    actualizarServicio,
    eliminarServicio
} from './services.controller.js';

const router = express.Router();

// rutas CRUD para servicios
router.get('/', obtenerServicios);
router.get('/:id', obtenerServicio);
router.post('/', crearServicio);
router.put('/:id', actualizarServicio);
router.delete('/:id', eliminarServicio);

export default router;
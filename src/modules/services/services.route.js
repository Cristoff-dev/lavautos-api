import express from 'express';
import {
    obtenerServicios,
    obtenerServicio,
    crearServicio,
    actualizarServicio,
    eliminarServicio
} from './services.controller.js';
import { validarServicio } from './services.middleware.js';

const router = express.Router();

// rutas CRUD para servicios
router.get('/', obtenerServicios);
router.get('/:id', obtenerServicio);
router.post('/', validarServicio, crearServicio);
router.put('/:id', validarServicio, actualizarServicio);
router.delete('/:id', eliminarServicio);

export default router;
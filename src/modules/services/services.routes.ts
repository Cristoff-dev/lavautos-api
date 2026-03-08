import { Router } from 'express';
import {
    obtenerServicios,
    obtenerServicio,
    crearServicio,
    actualizarServicio,
    eliminarServicio
} from './services.controller.js';

const enrutadorServicios = Router();

enrutadorServicios.get('/', obtenerServicios);
enrutadorServicios.get('/:id', obtenerServicio);
enrutadorServicios.post('/', crearServicio);
enrutadorServicios.put('/:id', actualizarServicio);
enrutadorServicios.delete('/:id', eliminarServicio);

export default enrutadorServicios;

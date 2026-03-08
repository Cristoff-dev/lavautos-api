import { Router } from 'express';
import {
    obtenerProveedores,
    obtenerProveedor,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor
} from './providers.controller.js';

const enrutadorProveedores = Router();

enrutadorProveedores.get('/', obtenerProveedores);
enrutadorProveedores.get('/:id', obtenerProveedor);
enrutadorProveedores.post('/', crearProveedor);
enrutadorProveedores.put('/:id', actualizarProveedor);
enrutadorProveedores.delete('/:id', eliminarProveedor);

export default enrutadorProveedores;

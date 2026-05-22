import response from '../../shared/utils/responses.js';

export function validarIdParam(req, res, next) {
    const { id } = req.params;
    if (!id || isNaN(id) || parseInt(id) <= 0) {
        return response.BadRequest(res, 'El ID proporcionado no es válido.');
    }
    next();
}

export function validarCrearProveedor(req, res, next) {
    const { rif, nombre, email } = req.body;
    const errores = [];

    if (!rif || typeof rif !== 'string' || rif.trim() === '') errores.push('El campo "rif" es obligatorio.');
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') errores.push('El campo "nombre" es obligatorio.');
    if (email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) errores.push('El formato del correo electrónico es inválido.');

    if (errores.length > 0) return response.BadRequest(res, errores);

    req.body.rif = req.body.rif.trim().toUpperCase();
    req.body.nombre = req.body.nombre.trim();
    next();
}

export function validarActualizarProveedor(req, res, next) {
    const { rif, nombre, email } = req.body;
    const errores = [];

    if (rif !== undefined && (typeof rif !== 'string' || rif.trim() === '')) errores.push('El campo "rif" no puede estar vacío si se incluye.');
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') errores.push('El campo "nombre" es obligatorio para actualizar.');
    if (email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) errores.push('El formato del correo electrónico es inválido.');

    if (errores.length > 0) return response.BadRequest(res, errores);

    if (req.body.rif) req.body.rif = req.body.rif.trim().toUpperCase();
    if (req.body.nombre) req.body.nombre = req.body.nombre.trim();
    next();
}
export function validarCrearProveedor(req, res, next) {
    const { rif, nombre } = req.body;
    const errores = [];

    if (!rif || typeof rif !== 'string' || rif.trim() === '') {
        errores.push('El campo "rif" es obligatorio.');
    }

    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        errores.push('El campo "nombre" es obligatorio.');
    }

    if (errores.length > 0) {
        return res.status(400).json({ error: 'Datos inválidos', detalles: errores });
    }

    next();
}

export function validarActualizarProveedor(req, res, next) {
    const { nombre } = req.body;
    const errores = [];

    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        errores.push('El campo "nombre" es obligatorio.');
    }

    if (errores.length > 0) {
        return res.status(400).json({ error: 'Datos inválidos', detalles: errores });
    }

    next();
}

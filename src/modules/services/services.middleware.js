export function validarServicio(req, res, next) {
    const { nombre, precio } = req.body;
    const errores = [];

    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        errores.push('El campo "nombre" es obligatorio.');
    }

    if (precio === undefined || precio === null || isNaN(Number(precio)) || Number(precio) < 0) {
        errores.push('El campo "precio" es obligatorio y debe ser un número positivo.');
    }

    if (errores.length > 0) {
        return res.status(400).json({ error: 'Datos inválidos', detalles: errores });
    }

    next();
}

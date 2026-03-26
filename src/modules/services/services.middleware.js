// Middlewares del módulo de servicios.
// Si en un futuro se requiere validar datos de entrada o permisos
// específicos, se pueden añadir aquí. Por ahora no hay reglas extra.

export function validarServicio(req, res, next) {
    // ejemplo: comprobar que precio y nombre estén presentes
    next();
}

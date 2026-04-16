import response from '../../shared/utils/responses.js';
import validators from '../../shared/utils/format.data.js';

// Validar ID de parámetro
const validateIdParam = (req, res, next) => {
    const { id } = req.params;
    if (!id || validators.formatNumberInvalid(id)) {
        return response.BadRequest(res, 'ID inválido o no proporcionado.');
    }
    next();
};

// Validar creación/actualización de transacción
const validarTransaccion = (req, res, next) => {
    const { categoria, descripcion, monto } = req.body;
    let errors = [];

    // Campos requeridos
    if (!categoria) {
        errors.push('La categoría es requerida.');
    }
    if (!descripcion) {
        errors.push('La descripción es requerida.');
    }
    if (monto === undefined || monto === null) {
        errors.push('El monto es requerido.');
    }

    // Validar categoría
    const categoriasValidas = [
        'INGRESO_LAVADO',
        'GASTO_OPERATIVO',
        'COMPRA_INSUMO',
        'OTRO_INGRESO',
        'OTRO_EGRESO'
    ];
    if (categoria && !categoriasValidas.includes(categoria)) {
        errors.push('Categoría inválida.');
    }

    // Validar descripción
    if (descripcion && (typeof descripcion !== 'string' || descripcion.trim().length < 2)) {
        errors.push('La descripción debe tener al menos 2 caracteres.');
    }
    if (descripcion && descripcion.length > 500) {
        errors.push('La descripción no puede exceder los 500 caracteres.');
    }

    // Validar monto
    if (monto !== undefined && (validators.formatMoneyInvalid(monto.toString()) || monto <= 0)) {
        errors.push('El monto debe ser un número positivo.');
    }
    if (monto && monto > 999999999) {
        errors.push('El monto no puede ser mayor a 999,999,999.');
    }

    if (errors.length > 0) return response.BadRequest(res, errors);
    next();
};

// Validar fechas para historial
const validarFechas = (req, res, next) => {
    const { fechaInicio, fechaFin } = req.query;
    let errors = [];

    if (!fechaInicio) {
        errors.push('La fecha de inicio es requerida.');
    }
    if (!fechaFin) {
        errors.push('La fecha de fin es requerida.');
    }

    if (fechaInicio && fechaFin) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);

        if (isNaN(inicio.getTime())) {
            errors.push('La fecha de inicio no es válida.');
        }
        if (isNaN(fin.getTime())) {
            errors.push('La fecha de fin no es válida.');
        }
        if (inicio > fin) {
            errors.push('La fecha de inicio no puede ser posterior a la fecha de fin.');
        }
    }

    if (errors.length > 0) return response.BadRequest(res, errors);
    next();
};

export default {
    validateIdParam,
    validarTransaccion,
    validarFechas
};
import response from '../../shared/utils/responses.js';
import validators from '../../shared/utils/format.data.js';

// Validar creación de insumo
const validateAddInsumo = (req, res, next) => {
    const { nombre, stockActual, stockMinimo } = req.body;
    let errors = [];

    // Campos requeridos
    if (!nombre || stockActual === undefined || stockMinimo === undefined) {
        return response.BadRequest(res, 'Faltan parámetros: nombre, stockActual y stockMinimo son requeridos.');
    }

    // Validar nombre
    if (typeof nombre !== 'string' || nombre.trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres.');
    }
    if (nombre.length > 100) {
        errors.push('El nombre no puede exceder los 100 caracteres.');
    }

    // Validar stocks
    if (validators.formatMoneyInvalid(stockActual.toString()) || stockActual < 0) {
        errors.push('El stock actual debe ser un número positivo.');
    }
    if (stockActual > 999999) {
        errors.push('El stock actual no puede ser mayor a 999,999.');
    }

    if (validators.formatMoneyInvalid(stockMinimo.toString()) || stockMinimo < 0) {
        errors.push('El stock mínimo debe ser un número positivo.');
    }
    if (stockMinimo > 999999) {
        errors.push('El stock mínimo no puede ser mayor a 999,999.');
    }

    if (errors.length > 0) return response.BadRequest(res, errors);
    next();
};

// Validar actualización de insumo
const validateUpdateInsumo = (req, res, next) => {
    const { id } = req.params;
    const { nombre, stockActual, stockMinimo } = req.body;
    let errors = [];

    // Validar ID
    if (!id || validators.formatNumberInvalid(id)) {
        errors.push('ID inválido o no proporcionado.');
    }

    // Validaciones condicionales
    if (nombre !== undefined) {
        if (typeof nombre !== 'string' || nombre.trim().length < 2) {
            errors.push('El nombre debe tener al menos 2 caracteres.');
        }
        if (nombre.length > 100) {
            errors.push('El nombre no puede exceder los 100 caracteres.');
        }
    }

    if (stockActual !== undefined) {
        if (validators.formatMoneyInvalid(stockActual.toString()) || stockActual < 0) {
            errors.push('El stock actual debe ser un número positivo.');
        }
        if (stockActual > 999999) {
            errors.push('El stock actual no puede ser mayor a 999,999.');
        }
    }

    if (stockMinimo !== undefined) {
        if (validators.formatMoneyInvalid(stockMinimo.toString()) || stockMinimo < 0) {
            errors.push('El stock mínimo debe ser un número positivo.');
        }
        if (stockMinimo > 999999) {
            errors.push('El stock mínimo no puede ser mayor a 999,999.');
        }
    }

    if (errors.length > 0) return response.BadRequest(res, errors);
    next();
};

// Validar actualización de stock
const validateUpdateStock = (req, res, next) => {
    const { id } = req.params;
    const { cantidad, operacion } = req.body;
    let errors = [];

    // Validar ID
    if (!id || validators.formatNumberInvalid(id)) {
        errors.push('ID inválido o no proporcionado.');
    }

    // Validar cantidad
    if (cantidad === undefined) {
        errors.push('La cantidad es requerida.');
    } else if (validators.formatMoneyInvalid(cantidad.toString()) || cantidad < 0) {
        errors.push('La cantidad debe ser un número positivo.');
    } else if (cantidad > 999999) {
        errors.push('La cantidad no puede ser mayor a 999,999.');
    }

    // Validar operación (opcional)
    if (operacion && !['SET', 'SUMAR', 'RESTAR'].includes(operacion)) {
        errors.push('Operación inválida. Use: SET, SUMAR o RESTAR.');
    }

    if (errors.length > 0) return response.BadRequest(res, errors);
    next();
};

// Validar ID en parámetros
const validateIdParam = (req, res, next) => {
    const { id } = req.params;
    
    if (!id || validators.formatNumberInvalid(id)) {
        return response.BadRequest(res, 'ID inválido o no proporcionado.');
    }
    
    next();
};

export default {
    validateAddInsumo,
    validateUpdateInsumo,
    validateUpdateStock,
    validateIdParam
};
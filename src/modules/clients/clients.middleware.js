import response from '../../shared/utils/responses.js';
import validators from '../../shared/utils/format.data.js';

const addClientMiddleware = (req, res, next) => {
    const { cedula, nombre, telefono, email } = req.body;
    let errors = [];

    if (!cedula || !nombre || !telefono) {
        return response.BadRequest(res, 'Missing parameters: cedula, nombre and telefono are required.');
    }

    if (validators.formatNumberInvalid(cedula)) {
        errors.push('Cedula must be a numeric value.');
    } else if (cedula.toString().length < 5) {
        errors.push('Cedula is too short.');
    }

    if (validators.formatNamesInvalid(nombre)) errors.push('Invalid name format.');
    if (email && validators.formatEmailInvalid(email)) errors.push('Invalid email format.');

    if (errors.length > 0) return response.BadRequest(res, errors);
    next();
}

const updateClientMiddleware = (req, res, next) => {
    const { id } = req.params;
    // Quitamos 'cedula' de aquí, ya no la validamos en update porque no se debe cambiar
    const { nombre, email, telefono } = req.body; 
    let errors = [];

    if (!id || validators.formatNumberInvalid(id)) errors.push('Invalid ID.');
    
    if (nombre && validators.formatNamesInvalid(nombre)) errors.push('Invalid name format.');
    if (email && validators.formatEmailInvalid(email)) errors.push('Invalid email format.');
    if (telefono && typeof telefono !== 'string') errors.push('Phone must be a valid string.');

    if (errors.length > 0) return response.BadRequest(res, errors);
    next();
}

const deleteClientMiddleware = (req, res, next) => {
    const { id } = req.params;
    if (!id || validators.formatNumberInvalid(id)) return response.BadRequest(res, 'Invalid or missing ID.');
    next();
}

export default { addClientMiddleware, updateClientMiddleware, deleteClientMiddleware };
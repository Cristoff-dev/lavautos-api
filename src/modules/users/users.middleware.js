import response from '../../shared/utils/responses.js';
import validators from '../../shared/utils/format.data.js';

const rolesValidos = ["ADMIN", "CAJERO", "SUPERVISOR", "LAVADOR"];

const addUserMiddleware = (req, res, next) => {
    // Extraemos username en lugar de email
    const { nombre, username, password, rol } = req.body;
    let errors = [];

    if (!nombre || !username || !password || !rol) {
        return response.BadRequest(res, 'Missing parameters: nombre, username, password and rol are required.');
    }

    if (validators.formatNamesInvalid(nombre)) errors.push('Invalid name.');
    
    // Validación simple para username (ej: mínimo 3 caracteres, sin espacios si quieres)
    if (username.length < 3) errors.push('Username must be at least 3 characters long.');
    
    if (validators.formatPasswordInvalid(password)) errors.push('Invalid password format.');
    if (!rolesValidos.includes(rol)) errors.push(`Invalid rol. Allowed: ${rolesValidos.join(', ')}`);

    if (errors.length > 0) return response.BadRequest(res, errors);
    next();
}

const deleteUserMiddleware = (req, res, next) => {
    const { id } = req.params;
    if (!id || validators.formatNumberInvalid(id)) {
        return response.BadRequest(res, 'Invalid or missing ID.');
    }
    next();
}

const updateUserMiddleware = (req, res, next) => {
    const { id } = req.params;
    const { nombre, username, rol, password } = req.body;
    let errors = [];

    if (!id || validators.formatNumberInvalid(id)) errors.push('Invalid ID.');
    if (rol && !rolesValidos.includes(rol)) errors.push('Invalid rol.');
    
    // Validación para username en update
    if (username && username.length < 3) errors.push('Username must be at least 3 characters long.');
    
    if (nombre && validators.formatNamesInvalid(nombre)) errors.push('Invalid name.');
    if (password && validators.formatPasswordInvalid(password)) errors.push('Invalid password format.');

    if (errors.length > 0) return response.BadRequest(res, errors);
    next();
}

export default { addUserMiddleware, deleteUserMiddleware, updateUserMiddleware };
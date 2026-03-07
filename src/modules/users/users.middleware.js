import response from '../../shared/utils/responses.js';
import validators from '../../shared/utils/format.data.js';

const rolesValidos = ["ADMIN", "CAJERO", "SUPERVISOR", "LAVADOR"];

const addUserMiddleware = (req, res, next) => {
    const { nombre, email, password, rol } = req.body;
    let errors = [];

    if (!nombre || !email || !password || !rol) {
        return response.BadRequest(res, 'Missing parameters: nombre, email, password and rol are required.');
    }

    if (validators.formatNamesInvalid(nombre)) errors.push('Invalid name.');
    if (validators.formatEmailInvalid(email)) errors.push('Invalid email format.');
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
    const { nombre, email, rol, password } = req.body;
    let errors = [];

    if (!id || validators.formatNumberInvalid(id)) errors.push('Invalid ID.');
    if (rol && !rolesValidos.includes(rol)) errors.push('Invalid rol.');
    if (email && validators.formatEmailInvalid(email)) errors.push('Invalid email.');
    if (nombre && validators.formatNamesInvalid(nombre)) errors.push('Invalid name.');
    // Validar contraseña si la están intentando actualizar
    if (password && validators.formatPasswordInvalid(password)) errors.push('Invalid password format.');

    if (errors.length > 0) return response.BadRequest(res, errors);
    next();
}

export default { addUserMiddleware, deleteUserMiddleware, updateUserMiddleware };
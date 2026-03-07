import response from '../../shared/utils/responses.js';
import validator from '../../shared/utils/format.data.js';

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    let details = [];

    if (!email || !password) {
        return response.BadRequest(res, 'Email and password are required fields.');
    }

    if (validator.formatEmailInvalid(email)) {
        details.push('The email format is not valid.');
    }
    
    // Aquí podrías agregar validaciones de longitud de password si fuera necesario
    if (details.length > 0) {
        return response.ParametersInvalid(res, details);
    }

    next();
}

export default validateLogin; 
import response from '../../shared/utils/responses.js';
import validator from '../../shared/utils/format.data.js';

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    let details = [];

    if (!email || !password) {
        return response.BadRequest(res, 'The email and password are required.');
    }

    if (validator.formatEmailInvalid(email)) details.push('The email format is invalid.');
    if (validator.formatPasswordInvalid(password)) details.push('The password format is invalid.');

    if (details.length > 0) return response.ParametersInvalid(res, details);
    next();
}

export default validateLogin;
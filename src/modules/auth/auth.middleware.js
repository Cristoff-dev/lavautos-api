import response from '../../shared/utils/responses.js';

const validateLogin = (req, res, next) => {
    const { username, password } = req.body;
    let details = [];

    if (!username || !password) {
        return response.BadRequest(res, 'Username and password are required fields.');
    }

    if (username.length < 3) {
        details.push('Username must be at least 3 characters long.');
    }
    
    if (details.length > 0) {
        return response.ParametersInvalid(res, details);
    }

    next();
}

export default validateLogin;
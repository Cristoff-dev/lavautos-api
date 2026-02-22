import response from '../../shared/utils/responses.js';
import AuthService from './auth.service.js';
const authService = new AuthService();

class AuthController {
    constructor() { }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const object = { email, password };

            const result = await authService.login(object);
            return response.QuerySuccess(res, result);

        } catch (error) {
            if (error.message === 'User not found.' || error.message === 'Password not valid.') {
                return response.ItemNotFound(res, "Invalid credentials.");
            }
            if (error.message === 'User inactive.') {
                return response.UnauthorizedEdit(res, "User is inactive. Please contact the administrator.");
            }
            return response.ErrorInternal(res, error.message);
        }
    }
}

export default AuthController;
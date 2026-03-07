import response from '../../shared/utils/responses.js';
import AuthService from './auth.service.js';

const authService = new AuthService();

class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            // Pasamos un objeto limpio al servicio
            const result = await authService.login({ email, password });
            
            return response.QuerySuccess(res, result, "Login successful.");
        } catch (error) {
            // Mapeo de errores de lógica de negocio a respuestas HTTP
            if (error.message === 'USER_NOT_FOUND' || error.message === 'INVALID_PASSWORD') {
                return response.ItemNotFound(res, "Invalid credentials.");
            }
            if (error.message === 'USER_INACTIVE') {
                return response.UnauthorizedEdit(res, "Access denied. Your account is inactive.");
            }
            
            return response.ErrorInternal(res, error.message);
        }
    }
}

export default AuthController;
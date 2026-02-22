import bcrypt from 'bcrypt';
import Token from '../../shared/utils/token.access.js';
import AuthModel from './auth.model.js';
const authModel = new AuthModel();

class AuthService {
    constructor() { }

    async login(object) {
        try {
            // 1. Buscar usuario por email
            const result = await authModel.findByEmail(object.email);
            if (!result) throw new Error('User not found.');

            // 2. Validar si el empleado está activo en el sistema
            if (!result.activo) throw new Error('User inactive.');

            // 3. Verificar contraseña
            const validationPassword = await bcrypt.compare(object.password, result.password);
            if (!validationPassword) throw new Error('Password not valid.');

            // 4. Generar token y limpiar datos sensibles
            const token = await Token.genToken(result);
            delete result.password;

            return { token: token, user: result };
        } catch (error) { throw error; }
    }
}

export default AuthService;
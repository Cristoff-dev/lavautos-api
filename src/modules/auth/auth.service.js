import bcrypt from 'bcrypt';
import Token from '../../shared/utils/token.access.js';
import AuthModel from './auth.model.js';

const authModel = new AuthModel();

class AuthService {
    async login({ email, password }) {
        // 1. Verificar existencia del usuario
        const user = await authModel.findByEmail(email);
        if (!user) throw new Error('USER_NOT_FOUND');

        // 2. Verificar si está activo (Regla de negocio)
        if (!user.activo) throw new Error('USER_INACTIVE');

        // 3. Validar contraseña contra el hash de la DB
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error('INVALID_PASSWORD');

        // 4. Generar el JWT
        const token = await Token.genToken({
            id: user.id,
            email: user.email,
            rol: user.rol,
            nombre: user.nombre
        });

        // 5. Seguridad: Eliminar la contraseña del objeto antes de devolverlo
        delete user.password;

        return { token, user };
    }
}

export default AuthService;
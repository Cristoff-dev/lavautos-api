import bcrypt from 'bcrypt';
import Token from '../../shared/utils/token.access.js';
import AuthModel from './auth.model.js';

const authModel = new AuthModel();

class AuthService {
    async login({ username, password }) {
        // 1. Verificar existencia del usuario por username
        const user = await authModel.findByUsername(username);
        if (!user) throw new Error('USER_NOT_FOUND');

        // 2. Verificar si está activo
        if (!user.activo) throw new Error('USER_INACTIVE');

        // 3. Validar contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error('INVALID_PASSWORD');

        // 4. Generar el JWT (cambiando email por username)
        const token = await Token.genToken({
            id: user.id,
            username: user.username,
            rol: user.rol,
            nombre: user.nombre
        });

        // 5. Seguridad: Eliminar la contraseña
        delete user.password;

        return { token, user };
    }
}

export default AuthService;
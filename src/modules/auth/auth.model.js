import prisma from '../../shared/prisma/client.js';

class AuthModel {
    constructor() { }

    async findByEmail(email) {
        try {
            const result = await prisma.usuario.findUnique({
                where: { email },
                select: { id: true, email: true, rol: true, password: true, nombre: true, activo: true }
            });
            return result;
        } catch (error) { throw error; }
    }
}

export default AuthModel;
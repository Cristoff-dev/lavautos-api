import prisma from '../../shared/prisma/client.js';

class AuthModel {
    async findByUsername(username) {
        try {
            return await prisma.usuario.findUnique({
                where: { username },
                select: { 
                    id: true, 
                    username: true, 
                    rol: true, 
                    password: true, 
                    nombre: true, 
                    activo: true 
                }
            });
        } catch (error) {
            throw new Error(`Database Error: ${error.message}`);
        }
    }
}

export default AuthModel;
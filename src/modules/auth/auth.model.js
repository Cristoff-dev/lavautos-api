import prisma from '../../shared/prisma/client.js';

class AuthModel {
    async findByEmail(email) {
        try {
            // Buscamos en la tabla 'usuario' (según el modelo Usuario de Prisma)
            return await prisma.usuario.findUnique({
                where: { email },
                select: { 
                    id: true, 
                    email: true, 
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
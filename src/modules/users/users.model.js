import prisma from '../../shared/prisma/client.js';

class ModelUsers {
    // Select reutilizable: Quitamos email, añadimos username
    userSelect = {
        id: true,
        nombre: true,
        username: true, 
        rol: true,
        activo: true,
        createdAt: true,
        updatedAt: true
    };

    async addUser(object) {
        try {
            return await prisma.usuario.create({
                data: object,
                select: this.userSelect
            });
        } catch (error) { throw error; }
    }

    async getUsers(currentUser) {
        try {
            return await prisma.usuario.findMany({
                where: { id: { not: currentUser.id } },
                select: this.userSelect
            });
        } catch (error) { throw error; }
    }

    async deleteUser(id) {
        try {
            return await prisma.usuario.update({ 
                where: { id },
                data: { activo: false },
                select: this.userSelect
            });
        } catch (error) { throw error; }
    }

    async updateUser(id, object) {
        try {
            return await prisma.usuario.update({
                where: { id },
                data: object,
                select: this.userSelect
            });
        } catch (error) { throw error; }
    }

    // Nuevo método: buscar por username
    async getUserByUsername(username) {
        try {
            return await prisma.usuario.findUnique({ where: { username } });
        } catch (error) { throw error; }
    }

    async getUserById(id) {
        try {
            return await prisma.usuario.findUnique({ where: { id } });
        } catch (error) { throw error; }
    }

    async restoreUser(id) {
        try {
            return await prisma.usuario.update({ 
                where: { id },
                data: { activo: true },
                select: this.userSelect
            });
        } catch (error) { throw error; }
    }
}

export default ModelUsers;
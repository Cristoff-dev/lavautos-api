import prisma from '../../shared/prisma/client.js';

class ModelUsers {
    constructor() { }

    async addUser(object) {
        try {
            return await prisma.usuario.create({
                data: object,
                select: { id: true, nombre: true, email: true, rol: true, activo: true }
            });
        } catch (error) { throw error; }
    }

    async getUsers(currentUser) {
        try {
            return await prisma.usuario.findMany({
                where: { id: { not: currentUser.id } },
                select: { id: true, nombre: true, email: true, rol: true, activo: true }
            });
        } catch (error) { throw error; }
    }

    async deleteUser(id) {
    try {
        // para cambiar el estado a inactivo
        return await prisma.usuario.update({ 
            where: { id: id },
            data: { activo: false }
        });
    } catch (error) { throw error; }
}
    async updateUser(id, object) {
        try {
            return await prisma.usuario.update({
                where: { id: id },
                data: object,
                select: { id: true, nombre: true, email: true, rol: true, activo: true }
            });
        } catch (error) { throw error; }
    }

    async getUserByEmail(email) {
        try {
            return await prisma.usuario.findUnique({ where: { email: email } });
        } catch (error) { throw error; }
    }

    async getUserById(id) {
        try {
            return await prisma.usuario.findUnique({ where: { id: id } });
        } catch (error) { throw error; }
    }
    async restoreUser(id) {
        try {
            return await prisma.usuario.update({ 
                where: { id: id },
                data: { activo: true },
                select: { id: true, nombre: true, email: true, rol: true, activo: true }
            });
        } catch (error) { throw error; }
    }
}

export default ModelUsers;
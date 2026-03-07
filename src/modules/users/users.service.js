import bcrypt from 'bcrypt';
import ModelUsers from './users.model.js';

const model = new ModelUsers();

class ServiceUsers {
    async addUser(object) {
        try {
            const existingUser = await model.getUserByEmail(object.email);
            if (existingUser) throw new Error('EMAIL_ALREADY_EXISTS');

            object.password = await bcrypt.hash(object.password, 10);
            return await model.addUser(object);
        } catch (error) { throw error; }
    }

    async getUsers(currentUser) {
        try {
            return await model.getUsers(currentUser);
        } catch (error) { throw error; }
    }

    async deleteUser(id, currentUser) {
        try {
            if (id === currentUser.id) throw new Error("CANNOT_DELETE_SELF");
            
            const user = await model.getUserById(id);
            if (!user) throw new Error('USER_NOT_FOUND');

            return await model.deleteUser(id);
        } catch (error) { throw error; }
    }

    async updateUser(userData, currentUser) {
        try {
            // REGLAS DE ORO PARA EL ADMIN
            if (userData.id === currentUser.id) {
                if (userData.rol) throw new Error("CANNOT_CHANGE_OWN_ROLE");
                if (userData.activo === false) throw new Error("CANNOT_DEACTIVATE_SELF");
            }

            const existUser = await model.getUserById(userData.id);
            if (!existUser) throw new Error('USER_NOT_FOUND');

            // Hash de contraseña si viene en el update
            if (userData.password) {
                userData.password = await bcrypt.hash(userData.password, 10);
            }

            const idToUpdate = userData.id;
            delete userData.id; // Limpiamos el ID del objeto para Prisma
            
            return await model.updateUser(idToUpdate, userData);
        } catch (error) { throw error; }
    }

    async restoreUser(id) {
        try {
            const user = await model.getUserById(id);
            if (!user) throw new Error('USER_NOT_FOUND');
            if (user.activo) throw new Error('USER_ALREADY_ACTIVE');

            return await model.restoreUser(id);
        } catch (error) { throw error; }
    }
}

export default ServiceUsers;
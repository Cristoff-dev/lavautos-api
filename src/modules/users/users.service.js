import bcrypt from 'bcrypt';
import ModelUsers from './users.model.js';
const model = new ModelUsers();

class ServiceUsers {
    constructor() { }

    async addUser(object) {
        try {
            const existingUser = await model.getUserByEmail(object.email);
            if (existingUser) throw new Error('Already exist email.');

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
            if (id === currentUser.id) throw new Error("You can not delete yourself.");
            
            const user = await model.getUserById(id);
            if (!user) throw new Error('User not found.');

            return await model.deleteUser(id);
        } catch (error) { throw error; }
    }

    async updateUser(user, currentUser) {
        try {
            // REGLAS DE ORO PARA EL ADMIN
            if (user.id === currentUser.id) {
                if (user.rol) throw new Error("No puedes cambiar tu propio rol.");
                if (user.activo === false) throw new Error("No te puedes desactivar a ti mismo.");
            }

            const existUser = await model.getUserById(user.id);
            if (!existUser) throw new Error('User not found.');

            // Hash de contraseña si viene en el update
            if (user.password) {
                user.password = await bcrypt.hash(user.password, 10);
            }

            const id = user.id;
            delete user.id; // Limpiamos el objeto antes de enviar al model
            return await model.updateUser(id, user);
        } catch (error) { throw error; }
    }
}

export default ServiceUsers;
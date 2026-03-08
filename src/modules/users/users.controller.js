import response from '../../shared/utils/responses.js';
import ServiceUsers from './users.service.js';

const service = new ServiceUsers();

class ControllerUsers {
    async addUser(req, res) {
        try {
            const result = await service.addUser(req.body);
            // Devolvemos el objeto creado para que el Front sepa qué ID se asignó
            return response.QuerySuccess(res, result, "User created successfully.");
        } catch (error) {
            if (error.message === 'USERNAME_ALREADY_EXISTS') return response.ResConflict(res, "The username is already taken.");
            return response.ErrorInternal(res, error.message);
        }
    }

    async getUsers(req, res) {
        try {
            const result = await service.getUsers(req.user);
            return response.QuerySuccess(res, result);
        } catch (error) {
            return response.ErrorInternal(res, error.message);
        }
    }

    async deleteUser(req, res) {
        try {
            const id = parseInt(req.params.id);
            await service.deleteUser(id, req.user);
            // Mensaje descriptivo en lugar de null
            return response.QuerySuccess(res, `Se desactivó el usuario con ID ${id}`, "User deactivated successfully.");
        } catch (error) {
            if (error.message === 'CANNOT_DELETE_SELF') return response.ResConflict(res, "You cannot deactivate yourself.");
            if (error.message === 'USER_NOT_FOUND') return response.ItemNotFound(res, "User not found.");
            return response.ErrorInternal(res, error.message);
        }
    }

    async updateUser(req, res) {
        try {
            const id = parseInt(req.params.id);
            const userData = { id, ...req.body };
            const result = await service.updateUser(userData, req.user);
            // Devolvemos el objeto actualizado para confirmar los cambios
            return response.QuerySuccess(res, result, `Se actualizó el usuario con ID ${id}`);
        } catch (error) {
            if (error.message === 'USERNAME_ALREADY_EXISTS') return response.ResConflict(res, "This username is already taken.");
            if (error.message === 'CANNOT_CHANGE_OWN_ROLE') return response.ResConflict(res, "You cannot change your own role.");
            if (error.message === 'CANNOT_DEACTIVATE_SELF') return response.ResConflict(res, "You cannot deactivate yourself.");
            if (error.message === 'USER_NOT_FOUND') return response.ItemNotFound(res, "User not found.");
            return response.ErrorInternal(res, error.message);
        }
    }

    async restoreUser(req, res) {
        try {
            const id = parseInt(req.params.id);
            const result = await service.restoreUser(id);
            // Mensaje descriptivo confirmando la activación
            return response.QuerySuccess(res, `Se restauró con éxito el usuario ID ${id}`, "User restored successfully.");
        } catch (error) {
            if (error.message === 'USER_ALREADY_ACTIVE') return response.ResConflict(res, "User is already active.");
            if (error.message === 'USER_NOT_FOUND') return response.ItemNotFound(res, "User not found.");
            return response.ErrorInternal(res, error.message);
        }
    }
}

export default ControllerUsers;
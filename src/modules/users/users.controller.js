import response from '../../shared/utils/responses.js';
import ServiceUsers from './users.service.js';

const service = new ServiceUsers();

class ControllerUsers {
    async addUser(req, res) {
        try {
            const result = await service.addUser(req.body);
            return response.QuerySuccess(res, result, "User created successfully.");
        } catch (error) {
            if (error.message === 'EMAIL_ALREADY_EXISTS') {
                return response.ResConflict(res, "The email is already registered.");
            }
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
            await service.deleteUser(parseInt(req.params.id), req.user);
            return response.QuerySuccess(res, null, "User deactivated successfully.");
        } catch (error) {
            if (error.message === 'CANNOT_DELETE_SELF') return response.ResConflict(res, "You cannot deactivate yourself.");
            if (error.message === 'USER_NOT_FOUND') return response.ItemNotFound(res, "User not found.");
            return response.ErrorInternal(res, error.message);
        }
    }

    async updateUser(req, res) {
        try {
            const user = { id: parseInt(req.params.id), ...req.body };
            const result = await service.updateUser(user, req.user);
            return response.QuerySuccess(res, result, "User updated successfully.");
        } catch (error) {
            if (error.message === 'CANNOT_CHANGE_OWN_ROLE') return response.ResConflict(res, "You cannot change your own role.");
            if (error.message === 'CANNOT_DEACTIVATE_SELF') return response.ResConflict(res, "You cannot deactivate yourself.");
            if (error.message === 'USER_NOT_FOUND') return response.ItemNotFound(res, "User not found.");
            return response.ErrorInternal(res, error.message);
        }
    }

    async restoreUser(req, res) {
        try {
            const result = await service.restoreUser(parseInt(req.params.id));
            return response.QuerySuccess(res, result, "User restored successfully.");
        } catch (error) {
            if (error.message === 'USER_ALREADY_ACTIVE') return response.ResConflict(res, "User is already active.");
            if (error.message === 'USER_NOT_FOUND') return response.ItemNotFound(res, "User not found.");
            return response.ErrorInternal(res, error.message);
        }
    }
}

export default ControllerUsers;
import response from '../../shared/utils/responses.js';
import ServiceUsers from './users.service.js';
const service = new ServiceUsers();

class ControllerUsers {
    async addUser(req, res) {
        try {
            const result = await service.addUser(req.body);
            return response.QuerySuccess(res, result);
        } catch (error) {
            if (error.message === 'Already exist email.') return response.ResConflict(res, error.message);
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
            const result = await service.deleteUser(parseInt(req.params.id), req.user);
            return response.QuerySuccess(res, "User deleted successfully.");
        } catch (error) {
            if (error.message === 'You can not delete yourself.') return response.ResConflict(res, error.message);
            return response.ErrorInternal(res, error.message);
        }
    }

    async updateUser(req, res) {
        try {
            const user = { id: parseInt(req.params.id), ...req.body };
            const result = await service.updateUser(user, req.user);
            return response.QuerySuccess(res, result);
        } catch (error) {
            // Manejo de errores de seguridad de auto-edición
            if (error.message.includes("You cannot change your own role") || 
                error.message.includes("You cannot deactivate yourself")) {
                return response.ResConflict(res, error.message);
            }
            return response.ErrorInternal(res, error.message);
        }
    }

    async restoreUser(req, res) {
        try {
            const result = await service.restoreUser(parseInt(req.params.id));
            return response.QuerySuccess(res, result, "User restored successfully.");
        } catch (error) {
            if (error.message === 'User is already active.') return response.ResConflict(res, error.message);
            return response.ErrorInternal(res, error.message);
        }
    }
}

export default ControllerUsers;